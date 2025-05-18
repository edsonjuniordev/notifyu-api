export type CreateOrderInputDto = {
  accountId: string;
  planId: string;
}

export type CreateOrderOutputDto = {
  id: string;
  accountId: string;
  planId: string;
  amount: number;
  httpNotificationQuantity: number;
  status: string;
  invoiceUrl: string;
}
