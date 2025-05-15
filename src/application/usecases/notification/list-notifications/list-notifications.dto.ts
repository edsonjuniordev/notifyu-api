export type ListNotificationsInputDto = {
  accountId: string;
  page?: string;
  status?: string;
}

export type ListNotificationsOutputDto = {
  notifications: {
    id: string;
    accountId: string;
    payload: unknown;
    status: string;
    notificationDate: string;
    destination: string;
    createdAt: string;
    updatedAt: string;
  }[];
  nextPage: string;
}
