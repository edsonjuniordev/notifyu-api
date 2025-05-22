export enum WebhookEventType {
  PAYMENT_CONFIRMED = 'PAYMENT_CONFIRMED',
  PAYMENT_OVERDUE = 'PAYMENT_OVERDUE',
  PAYMENT_RECEIVED = 'PAYMENT_RECEIVED'
}

export type WebhookRequest = {
  event: WebhookEventType;
  payment: {
    externalReference: string;
  }
}
