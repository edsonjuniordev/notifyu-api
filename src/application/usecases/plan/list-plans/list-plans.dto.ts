export type ListPlansOutputDto = {
  plans: {
    id: string;
    name: string;
    notificationQuantity: number;
    amount: number;
    status: string;
  }[]
}
