export type ListPlansOutputDto = {
  plans: {
    id: string;
    name: string;
    httpNotificationQuantity: number;
    amount: number;
    status: string;
  }[]
}
