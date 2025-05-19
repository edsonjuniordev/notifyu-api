import { OrderRepository } from 'src/application/repositories/order.repository';
import { PayOrderInputDto } from './pay-order.dto';

export class PayOrderUsecase {
  constructor(private readonly orderRepository: OrderRepository) {}

  public async execute(input: PayOrderInputDto): Promise<void> {
    const order = await this.orderRepository.findById(input.orderId);

    order.pay();

    await this.orderRepository.update(order);
  }
}
