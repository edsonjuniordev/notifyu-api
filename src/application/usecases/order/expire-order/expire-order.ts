import { OrderRepository } from 'src/application/repositories/order.repository';
import { ExpireOrderInputDto } from './expire-order.dto';

export class ExpireOrderUsecase {
  constructor(private readonly orderRepository: OrderRepository) { }

  public async execute(input: ExpireOrderInputDto): Promise<void> {
    const order = await this.orderRepository.findById(input.orderId);

    order.expire();

    await this.orderRepository.update(order);
  }
}
