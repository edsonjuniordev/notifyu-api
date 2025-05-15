export type CreatePlanInputDto = {
  name: string;
  notificationQuantity: number;
  amount: number;
}

export type CreatePlanOutputDto = {
  id: string;
  name: string;
  notificationQuantity: number;
  amount: number;
}
