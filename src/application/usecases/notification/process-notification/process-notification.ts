import { Notification, NotificationType } from 'src/application/domain/entities/notification.entity';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ProcessNotificationInputDto } from './process-notification.dto';

export class ProcessNotificationUsecase {
  constructor(private readonly notificationRepository: NotificationRepository) { }

  public async execute({
    id,
    accountId,
    payload,
    status,
    notificationDate,
    destination,
    notificationType,
    notifiedAt,
    createdAt,
    updatedAt,
  }: ProcessNotificationInputDto): Promise<void> {
    const notification = Notification.with({
      id,
      accountId,
      payload,
      status,
      notificationDate,
      destination,
      notificationType,
      notifiedAt,
      createdAt,
      updatedAt,
    });

    try {
      notification.notify();

      if (notification.getNotificationType() === NotificationType.HTTP) {
        const response = await fetch(destination, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload || {})
        });

        if (!response.ok) {
          notification.failed();
        }

        await this.notificationRepository.update(notification);
      }
    } catch (error) {
      console.log('🚀 ~ ProcessNotificationUsecase ~ error:', error);
      notification.failed();

      if (error.message !== 'unable to update status because it is different from CREATED') {
        await this.notificationRepository.update(notification);
      }
    }
  }
}
