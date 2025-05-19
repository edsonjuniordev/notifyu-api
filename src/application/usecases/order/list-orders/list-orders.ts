import { OrderRepository } from 'src/application/repositories/order.repository';
import { ListOrdersInputDto, ListOrdersOutputDto } from './list-orders.dto';
import { Order } from 'src/application/domain/entities/order.entity';

export class ListOrdersUsecase {
  constructor(private readonly orderRepository: OrderRepository) { }

  public async execute({
    accountId,
    page,
    status
  }: ListOrdersInputDto): Promise<ListOrdersOutputDto> {
    if (status) {
      const { nextPage, orders } = await this.orderRepository.listByStatus(accountId, page, status);

      return this.toOutput(nextPage, orders);
    }

    const { nextPage, orders } = await this.orderRepository.list(accountId, page);

    return this.toOutput(nextPage, orders);
  }

  private toOutput(nextPage: string, orders: Order[]): ListOrdersOutputDto {
    return {
      nextPage,
      orders: orders.map((order) => ({
        id: order.getId(),
        accountId: order.getAccountId(),
        planId: order.getPlanId(),
        amount: order.getAmount(),
        httpNotificationQuantity: order.getHttpNotificationQuantity(),
        status: order.getStatus(),
        invoiceUrl: order.getInvoiceUrl(),
      }))
    };
  }
}
