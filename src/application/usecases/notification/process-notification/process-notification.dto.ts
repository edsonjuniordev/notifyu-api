export type ProcessNotificationInputDto = {
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
