export type GetAccountInputDto = {
  accountId: string;
}

export type GetAccountOutputDto = {
  id: string;
  name: string;
  email: string;
  document: string;
  httpNotificationQuantity: number;
}
