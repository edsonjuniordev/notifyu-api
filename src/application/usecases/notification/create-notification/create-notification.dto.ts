export type CreateNotificationInputDto = {
  accountId: string;
  payload: unknown;
  notificationDate: string;
  destination: string;
  notificationType: string;
}

export type CreateNotificationOutputDto = {
  id: string;
  accountId: string;
  payload: unknown;
  status: string;
  notificationDate: string;
  destination: string;
  notificationType: string;
  createdAt: string;
  updatedAt: string;
}
