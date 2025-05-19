export type ListOrdersInputDto = {
  accountId: string;
  page?: string;
  status?: string;
}

export type ListOrdersOutputDto = {
  nextPage: string;
  orders: {
    id: string;
    accountId: string;
    planId: string;
    amount: number;
    httpNotificationQuantity: number;
    status: string;
    externalId?: string;
    invoiceUrl?: string;
  }[]
}
