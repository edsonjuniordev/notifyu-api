import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { Datetime } from 'src/application/utils/datetime';
import { TABLE_NAME } from '../../../dynamo-client';

export class NotificationEntityToModelMapper {
  public static map(notification: Notification): PutCommand {
    const dateTime = Datetime.addHoursToIsoString(notification.getNotificationDate(), 3);
    const TTL = Datetime.convertToUnix(dateTime);

    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `NOTIFICATION#${notification.getAccountId()}`,
        SK: `NOTIFICATION#${notification.getStatus()}`,
        GSI1PK: `NOTIFICATION#${notification.getId()}`,
        GSI1SK: `NOTIFICATION#${notification.getId()}`,
        type: 'NOTIFICATION',
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus().toString(),
        notificationDate: notification.getNotificationDate(),
        destination: notification.getDestination(),
        notificationType: notification.getNotificationType(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
        TTL
      },
    });
  }
}
