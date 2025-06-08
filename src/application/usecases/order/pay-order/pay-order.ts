import { OrderRepository } from 'src/application/repositories/order.repository';
import { PayOrderInputDto } from './pay-order.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { GenerateULID } from 'src/application/utils/generate-ulid';

export class PayOrderUsecase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly accountRepository: AccountRepository
  ) { }

  public async execute(input: PayOrderInputDto): Promise<void> {
    const lockOwner = GenerateULID.generate();

    const order = await this.orderRepository.findById(input.orderId);
    const account = await this.accountRepository.findByIdAndLock(order.getAccountId(), lockOwner);

    try {
      order.pay();

      account.addHttpNotificationQuantity(order.getHttpNotificationQuantity());

      await this.orderRepository.update(order);
      await this.accountRepository.update(account, lockOwner);
    } catch (error) {
      await this.accountRepository.unlock(account, lockOwner);
      throw error;
    }
  }
}
