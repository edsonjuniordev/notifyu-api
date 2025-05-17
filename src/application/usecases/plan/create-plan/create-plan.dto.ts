export type CreatePlanInputDto = {
  name: string;
  httpNotificationQuantity: number;
  amount: number;
}

export type CreatePlanOutputDto = {
  id: string;
  name: string;
  httpNotificationQuantity: number;
  amount: number;
}
