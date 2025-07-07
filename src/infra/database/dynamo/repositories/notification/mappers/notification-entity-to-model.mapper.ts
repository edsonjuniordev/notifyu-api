import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { Datetime } from 'src/application/utils/datetime';
import { TABLE_NAME } from '../../../dynamo-client';

export class NotificationEntityToModelMapper {
  public static map(notification: Notification): PutCommand {
    const notificationDateDateTime = Datetime.addHoursToIsoString(notification.getNotificationDate(), 3);
    const notificationDatePlusHours = Datetime.roundToExactMinute(new Date(notificationDateDateTime)).toISOString();

    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `NOTIFICATION#${notification.getAccountId()}`,
        SK: `NOTIFICATION#${notification.getId()}`,
        GSI1PK: `NOTIFICATION#${notification.getAccountId()}`,
        GSI1SK: `NOTIFICATION#${notification.getStatus()}#${notification.getId()}`,
        GSI2PK: 'NOTIFICATION',
        GSI2SK: `NOTIFICATION#${notificationDatePlusHours}#${notification.getStatus().toString()}`,
        GSI3PK: `NOTIFICATION#${notification.getAccountId()}`,
        GSI3SK: `NOTIFICATION#${notificationDatePlusHours}#${notification.getStatus().toString()}`,
        type: 'NOTIFICATION',
        id: notification.getId(),
        accountId: notification.getAccountId(),
        payload: notification.getPayload(),
        status: notification.getStatus().toString(),
        notificationDate: notification.getNotificationDate(),
        destination: notification.getDestination(),
        notificationType: notification.getNotificationType(),
        notifiedAt: notification.getNotifiedAt(),
        createdAt: notification.getCreatedAt(),
        updatedAt: notification.getUpdatedAt(),
      },
    });
  }
}
