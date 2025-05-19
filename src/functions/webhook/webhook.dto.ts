export enum WebhookEventType {
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE'
}

export type WebhookRequest = {
  event: WebhookEventType;
  payment: {
    externalReference: string;
  }
}
