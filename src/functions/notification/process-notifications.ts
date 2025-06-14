import { Notification } from 'src/application/domain/entities/notification.entity';
import { ProcessNotificationUsecase } from 'src/application/usecases/notification/process-notification/process-notification';
import { Datetime } from 'src/application/utils/datetime';
import { dynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';

const processNotificationUsecase = new ProcessNotificationUsecase(dynamoNotificationRepository);

export async function handler() {
  const now = new Date();
  console.log('🚀 ~ handler ~ now:', now);

  const datetime = Datetime.roundToExactMinute(now);
  console.log('🚀 ~ handler ~ datetime:', datetime);

  const notifications = await getNotifications(datetime.toISOString());

  const processNotificationPromises = notifications.map((notification) => processNotificationUsecase.execute({
    id: notification.getId(),
    accountId: notification.getAccountId(),
    payload: notification.getPayload(),
    status: notification.getStatus(),
    notificationDate: notification.getNotificationDate(),
    destination: notification.getDestination(),
    notificationType: notification.getNotificationType(),
    notifiedAt: notification.getNotifiedAt(),
    createdAt: notification.getCreatedAt(),
    updatedAt: notification.getUpdatedAt(),
  }));

  await Promise.all(processNotificationPromises);
}

async function getNotifications(datetime: string, page = '', accumulatedNotifications: Notification[] = []) {
  const { notifications, nextPage } = await dynamoNotificationRepository.listByNotificationDateAndStatusCreated(datetime, page);

  const newAccumulatedNotifications = [...accumulatedNotifications, ...notifications];

  if (nextPage) {
    return getNotifications(datetime, nextPage, newAccumulatedNotifications);
  }

  return newAccumulatedNotifications;
}
