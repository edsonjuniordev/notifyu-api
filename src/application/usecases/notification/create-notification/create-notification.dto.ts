export type CreateNotificationInputDto = {
  accountId: string;
  payload: unknown;
  notificationDate: string;
  destination: string;
}

export type CreateNotificationOutputDto = {
  id: string;
  accountId: string;
  payload: unknown;
  status: string;
  notificationDate: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}
