import { Controller, Post, Headers, Body, BadRequestException } from '@nestjs/common';
import { WebhooksService } from './webhooks.service';

@Controller('webhooks')
export class WebhooksController {
  constructor(private readonly webhooksService: WebhooksService) {}

  @Post('waha')
  async handleWahaWebhook(
    @Headers('x-waha-webhook-token') token: string,
    @Body() payload: any,
  ) {
    if (token !== process.env.WAHA_WEBHOOK_SECRET) {
      throw new BadRequestException('Invalid webhook token');
    }

    await this.webhooksService.handleInboundMessage(payload);
    return { status: 'ok' };
  }
}
