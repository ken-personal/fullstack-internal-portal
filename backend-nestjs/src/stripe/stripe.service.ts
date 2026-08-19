import { Injectable, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from '../database/prisma.service';
import { MailService } from '../mail/mail.service';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor(
    private prisma: PrismaService,
    private mail: MailService,
  ) {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
      apiVersion: '2026-02-25.clover',
    });
  }

  async handleWebhook(rawBody: Buffer, sig: string): Promise<void> {
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

    // 1. 署名検証（改ざん・リプレイ攻撃防止）
    let event: Stripe.Event;
    try {
      event = this.stripe.webhooks.constructEvent(rawBody, sig, webhookSecret);
    } catch {
      throw new BadRequestException('Webhook signature verification failed');
    }

    // 2. 冪等性チェック（completed のみ対象。failed は Stripe リトライで再処理させる）
    const already = await this.prisma.stripeEvent.findFirst({
      where: { id: event.id, status: 'completed' },
    });
    if (already) return;

    // 3. イベント処理（失敗時は failed 記録 → リスロー → Stripe が自動リトライ）
    try {
      if (event.type === 'checkout.session.completed') {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.metadata?.userId;
        // TODO: userId に対してサブスクリプション有効化処理を実装
        console.log(`Subscription activated for userId: ${userId}`);
      }

      // 4. 処理成功を記録
      await this.prisma.stripeEvent.upsert({
        where: { id: event.id },
        update: { status: 'completed' },
        create: { id: event.id, type: event.type, status: 'completed' },
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);

      // 失敗を記録（重複 upsert で上書き）
      await this.prisma.stripeEvent.upsert({
        where: { id: event.id },
        update: { status: 'failed' },
        create: { id: event.id, type: event.type, status: 'failed' },
      }).catch(() => {});

      // アラートメール送信（失敗しても握り潰す）
      this.mail.sendWebhookErrorAlert(event.id, event.type, message).catch(() => {});

      // 500 を返して Stripe に自動リトライさせる
      throw new InternalServerErrorException('Webhook processing failed');
    }
  }

  getPlans() {
    return [
      {
        id: 'basic',
        name: 'ベーシック',
        price: 980,
        priceId: 'price_basic',
        features: ['ユーザー5名まで', '基本機能', 'メールサポート'],
      },
      {
        id: 'pro',
        name: 'プロ',
        price: 2980,
        priceId: 'price_pro',
        features: ['ユーザー20名まで', '全機能', '優先サポート', 'AI機能'],
      },
      {
        id: 'enterprise',
        name: 'エンタープライズ',
        price: 9800,
        priceId: 'price_enterprise',
        features: ['無制限ユーザー', '全機能', '専任サポート', 'AI機能', 'カスタマイズ'],
      },
    ];
  }

  async createCheckoutSession(priceId: string, userId: string) {
    const plan = this.getPlans().find((p) => p.id === priceId);
    if (!plan) throw new Error('Invalid plan');

    const session = await this.stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: 'jpy',
            product_data: {
              name: plan.name,
              description: plan.features.join(' / '),
            },
            unit_amount: plan.price,
            recurring: { interval: 'month' },
          },
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `http://localhost:3000/stripe/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `http://localhost:3000/stripe/cancel`,
      metadata: { userId },
    });

    return { sessionId: session.id, url: session.url };
  }
}
