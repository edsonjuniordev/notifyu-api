import { OrderRepository } from 'src/application/repositories/order.repository';
import { PayOrderInputDto } from './pay-order.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';

export class PayOrderUsecase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly accountRepository: AccountRepository
  ) { }

  public async execute(input: PayOrderInputDto): Promise<void> {
    const order = await this.orderRepository.findById(input.orderId);
    const account = await this.accountRepository.findByIdAndLock(order.getAccountId());

    try {
      order.pay();

      account.addHttpNotificationQuantity(order.getHttpNotificationQuantity());

      await this.orderRepository.update(order);
      await this.accountRepository.update(account);
    } catch (error) {
      await this.accountRepository.unlock(account);
      throw error;
    }
  }
}
