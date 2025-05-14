export type ListNotificationsInputDto = {
  accountId: string;
  page?: string;
  status?: string;
}

export type ListNotificationsOutputDto = {
  notifications: {
    id: string;
    accountId: string;
    payload: string;
    status: string;
    notificationDate: string;
    createdAt: string;
    updatedAt: string;
  }[];
  nextPage: string;
}
