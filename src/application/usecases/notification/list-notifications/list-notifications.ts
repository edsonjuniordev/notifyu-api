import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ListNotificationsInputDto, ListNotificationsOutputDto } from './list-notifications.dto';
import { Notification } from 'src/application/domain/entities/notification.entity';

export class ListNotificationsUsecase {
  constructor(private readonly notificationRepository: NotificationRepository) { }

  public async execute({
    accountId,
    page,
    status,
    notificationDate
  }: ListNotificationsInputDto): Promise<ListNotificationsOutputDto> {
    if (notificationDate && status) {
      const { nextPage, notifications } = await this.notificationRepository.listByNotificationDateAndStatus(accountId, notificationDate, status, page);

      return this.toOutput(nextPage, notifications);
    }

    if (notificationDate) {
      const { nextPage, notifications } = await this.notificationRepository.listByNotificationDate(accountId, notificationDate, page);

      return this.toOutput(nextPage, notifications);
    }

    if (status) {
      const { nextPage, notifications } = await this.notificationRepository.listByStatus(accountId, status, page);

      return this.toOutput(nextPage, notifications);
    }

    const { nextPage, notifications } = await this.notificationRepository.list(accountId, page);

    return this.toOutput(nextPage, notifications);
  }

  private toOutput(nextPage: string, notifications: Notification[]): ListNotificationsOutputDto {
    return {
      nextPage,
      notifications: notifications.map((notification) => ({
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus(),
        notificationDate: notification.getNotificationDate(),
        destination: notification.getDestination(),
        notifiedAt: notification.getNotifiedAt(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      }))
    };
  }
}
