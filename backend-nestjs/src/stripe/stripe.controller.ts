import { Controller, Post, Body, Get, UseGuards, Headers, Req, HttpCode } from '@nestjs/common';
import { Request } from 'express';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stripe')
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  // Webhook は Stripe からの呼び出しのため JWT 認証なし・rawBody が必要
  @Post('webhook')
  @HttpCode(200)
  async handleWebhook(
    @Req() req: Request,
    @Headers('stripe-signature') sig: string,
  ) {
    await this.stripeService.handleWebhook(req.body as Buffer, sig);
    return { received: true };
  }

  @Get('plans')
  @UseGuards(JwtAuthGuard)
  getPlans() {
    return this.stripeService.getPlans();
  }

  @Post('create-checkout-session')
  @UseGuards(JwtAuthGuard)
  async createCheckoutSession(@Body() body: { priceId: string; userId: string }) {
    return this.stripeService.createCheckoutSession(body.priceId, body.userId);
  }
}
