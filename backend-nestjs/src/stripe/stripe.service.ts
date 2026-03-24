import { Injectable } from '@nestjs/common';
import Stripe from 'stripe';

@Injectable()
export class StripeService {
  private stripe: Stripe;

  constructor() {
    this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
    apiVersion: '2026-02-25.clover',
    });
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
