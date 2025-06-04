export type ListNotificationsInputDto = {
  accountId: string;
  page?: string;
  status?: string;
  notificationDate?: string;
}

export type ListNotificationsOutputDto = {
  notifications: {
    id: string;
    accountId: string;
    payload: unknown;
    status: string;
    notificationDate: string;
    destination: string;
    notifiedAt: string;
    createdAt: string;
    updatedAt: string;
  }[];
  nextPage: string;
}
