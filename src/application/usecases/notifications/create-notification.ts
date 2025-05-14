import { AccountRepository } from 'src/application/repositories/account.repository';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { CreateNotificationInputDto, CreateNotificationOutputDto } from './create-notification.dto';
import { Notification } from 'src/application/domain/entities/notification.entity';

export class CreateNotificationUsecase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly notificationRepository: NotificationRepository
  ) { }

  public async execute(input: CreateNotificationInputDto): Promise<CreateNotificationOutputDto> {
    const account = await this.accountRepository.findByIdAndLock(input.accountId);

    if (!account) {
      throw new Error('account not found');
    }

    try {
      account.decreaseNotifications();

      const notification = Notification.create({
        accountId: input.accountId,
        payload: input.payload,
        notificationDate: input.notificationDate,
      });

      await this.notificationRepository.create(notification);
      await this.accountRepository.update(account);

      return {
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus(),
        notificationDate: notification.getNotificationDate(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      };
    } catch (error) {
      await this.accountRepository.unlock(account);
      throw error;
    }
  }
}
