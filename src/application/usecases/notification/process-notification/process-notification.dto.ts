export type ProcessNotificationInputDto = {
  id: string;
  accountId: string;
  payload: unknown;
  status: string;
  notificationDate: string;
  destination: string;
  notificationType: string;
  notifiedAt: string;
  createdAt: string;
  updatedAt: string;
}
