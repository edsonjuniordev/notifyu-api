import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ListNotificationsInputDto, ListNotificationsOutputDto } from './list-notifications.dto';

export class ListNotificationsUsecase {
  constructor(private readonly notificationRepository: NotificationRepository) {}

  public async execute(input: ListNotificationsInputDto): Promise<ListNotificationsOutputDto> {
    const { nextPage, notifications } = await this.notificationRepository.list(input.accountId, input.page);

    return {
      nextPage,
      notifications: notifications.map((notification) => ({
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus(),
        notificationDate: notification.getNotificationDate(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      }))
    };
  }
}
