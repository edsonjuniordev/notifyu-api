import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { CancelNotificationInputDto } from './cancel-notification.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { GenerateULID } from 'src/application/utils/generate-ulid';

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

    const lockOwner = GenerateULID.generate();

    const account = await this.accountRepository.findByIdAndLock(notification.getAccountId(), lockOwner);

    try {
      notification.cancel();
      account.addHttpNotificationQuantity(1);

      await this.notificationRepository.update(notification);
      await this.accountRepository.update(account, lockOwner);
    } catch (error) {
      this.accountRepository.unlock(account, lockOwner);
      throw error;
    }
  }
}
