import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { CancelNotificationInputDto } from './cancel-notification.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';

export class CancelNotificationUsecase {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly accountRepository: AccountRepository
  ) {}

  public async execute(input: CancelNotificationInputDto): Promise<void> {
    const notification = await this.notificationRepository.findById(input.notificationId, input.accountId);

    if (!notification) {
      throw new Error('notification not found');
    }

    const account = await this.accountRepository.findByIdAndLock(notification.getAccountId());

    try {
      notification.cancel();
      account.addHttpNotificationQuantity(1);

      await this.notificationRepository.update(notification);
      await this.accountRepository.update(account);
    } catch (error) {
      this.accountRepository.unlock(account);
      throw error;
    }
  }
}
