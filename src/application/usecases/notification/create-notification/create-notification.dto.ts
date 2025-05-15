export type CreateNotificationInputDto = {
  accountId: string;
  payload: string;
  notificationDate: string;
  destination: string;
}

export type CreateNotificationOutputDto = {
  id: string;
  accountId: string;
  payload: string;
  status: string;
  notificationDate: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}
