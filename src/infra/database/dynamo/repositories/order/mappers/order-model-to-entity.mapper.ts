import { Order } from 'src/application/domain/entities/order.entity';

export class OrderModelToEntityMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static map(model: any): Order {
    return Order.with({
      id: model.id,
      accountId: model.accountId,
      planId: model.planId,
      amount: model.amount,
      httpNotificationQuantity: model.httpNotificationQuantity,
      status: model.status,
      externalId: model.externalId,
      invoiceUrl: model.invoiceUrl,
    });
  }
}
