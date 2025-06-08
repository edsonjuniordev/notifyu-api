import { AccountRepository } from 'src/application/repositories/account.repository';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { CreateNotificationInputDto, CreateNotificationOutputDto } from './create-notification.dto';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { GenerateULID } from 'src/application/utils/generate-ulid';

export class CreateNotificationUsecase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly notificationRepository: NotificationRepository
  ) { }

  public async execute(input: CreateNotificationInputDto): Promise<CreateNotificationOutputDto> {
    const lockOwner = GenerateULID.generate();

    const account = await this.accountRepository.findByIdAndLock(input.accountId, lockOwner);

    if (!account) {
      throw new Error('account not found');
    }

    try {
      account.decreaseHttpNotifications();

      const notification = Notification.create({
        accountId: input.accountId,
        payload: input.payload,
        notificationDate: input.notificationDate,
        destination: input.destination,
        notificationType: input.notificationType
      });

      await this.notificationRepository.create(notification);
      await this.accountRepository.update(account, lockOwner);

      return {
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus(),
        notificationDate: notification.getNotificationDate(),
        destination: notification.getDestination(),
        notificationType: notification.getNotificationType(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      };
    } catch (error) {
      await this.accountRepository.unlock(account, lockOwner);
      throw error;
    }
  }
}
