import { ConfigService } from '@nestjs/config';

export const getPaymobConfig = (configService: ConfigService) => ({
  apiKey: configService.get('PAYMOB_API_KEY'),
  integrationId: configService.get('PAYMOB_INTEGRATION_ID'),
  iframeId: configService.get('PAYMOB_IFRAME_ID'),
  baseUrl: configService.get('PAYMOB_BASE_URL') || 'https://accept.paymob.com/api',
  webhookSecret: configService.get('PAYMOB_WEBHOOK_SECRET'),
});
