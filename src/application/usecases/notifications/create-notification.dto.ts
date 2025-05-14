export type CreateNotificationInputDto = {
  accountId: string;
  payload: string;
  notificationDate: string;
}

export type CreateNotificationOutputDto = {
  id: string;
  accountId: string;
  payload: string;
  status: string;
  notificationDate: string;
  createdAt: string;
  updatedAt: string;
}
