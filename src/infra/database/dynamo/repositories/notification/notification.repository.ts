import { Notification } from 'src/application/domain/entities/notification.entity';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { NotificationEntityToModelMapper } from './mappers/notification-entity-to-model.mapper';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoNotificationRepository implements NotificationRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(notification: Notification): Promise<void> {
    const command = NotificationEntityToModelMapper.map(notification);

    await this.dynamoClient.send(command);
  }

}
