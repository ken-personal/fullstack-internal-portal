import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { StripeService } from './stripe.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('stripe')
@UseGuards(JwtAuthGuard)
export class StripeController {
  constructor(private readonly stripeService: StripeService) {}

  @Get('plans')
  getPlans() {
    return this.stripeService.getPlans();
  }

  @Post('create-checkout-session')
  async createCheckoutSession(@Body() body: { priceId: string; userId: string }) {
    return this.stripeService.createCheckoutSession(body.priceId, body.userId);
  }
}
