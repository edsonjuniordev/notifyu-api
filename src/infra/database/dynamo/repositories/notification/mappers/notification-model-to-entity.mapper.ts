import { Notification } from 'src/application/domain/entities/notification.entity';

export class NotificationModelToEntityMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static map(model: any): Notification {
    return Notification.with({
      id: model.id,
      accountId: model.accountId,
      payload: model.payload,
      status: model.status,
      notificationDate: model.notificationDate,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
