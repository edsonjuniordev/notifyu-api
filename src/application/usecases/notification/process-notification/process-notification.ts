import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ProcessNotificationInputDto } from './process-notification.dto';
import { Notification } from 'src/application/domain/entities/notification.entity';

export class ProcessNotificationUsecase {
  constructor(private readonly notificationRepository: NotificationRepository) { }

  public async execute({
    id,
    accountId,
    payload,
    status,
    notificationDate,
    destination,
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
      createdAt,
      updatedAt,
    });

    try {
      const response = await fetch(destination, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload || {})
      });

      if (response.ok) {
        notification.notify();
      } else {
        notification.failed();
      }
    } catch (error) {
      console.log('🚀 ~ ProcessNotificationUsecase ~ error:', error);
      notification.failed();
    }

    await this.notificationRepository.recreate(notification);
  }
}
