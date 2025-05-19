import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { TABLE_NAME } from '../../dynamo-client';
import { NotificationEntityToModelMapper } from './mappers/notification-entity-to-model.mapper';
import { NotificationModelToEntityMapper } from './mappers/notification-model-to-entity.mapper';

export class DynamoNotificationRepository implements NotificationRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(notification: Notification): Promise<void> {
    const command = NotificationEntityToModelMapper.map(notification);

    await this.dynamoClient.send(command);
  }

  public async recreate(notification: Notification): Promise<void> {
    const command = NotificationEntityToModelMapper.map(notification);

    delete command.input.Item.TTL;

    await this.dynamoClient.send(command);
  }

  public async list(accountId: string, page: string): Promise<{ notifications: Notification[]; nextPage: string; }> {
    const lastEvaluatedKey = page ? this.decodeLastEvaluatedKey(page) : undefined;

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `NOTIFICATION#${accountId}`,
      },
      Limit: 10,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return {
        notifications: [],
        nextPage: null
      };
    }

    const notifications = items.map((item) => NotificationModelToEntityMapper.map(item));

    const lastEvaluatedKeyEncoded = result.LastEvaluatedKey ? this.encodeLastEvaluatedKey(result.LastEvaluatedKey) : null;

    return {
      notifications,
      nextPage: lastEvaluatedKeyEncoded
    };
  }

  public async listByStatus(accountId: string, page: string, status: string): Promise<{ notifications: Notification[]; nextPage: string; }> {
    const lastEvaluatedKey = page ? this.decodeLastEvaluatedKey(page) : undefined;

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `NOTIFICATION#${accountId}`,
        ':sk': `NOTIFICATION#${status.toUpperCase()}`
      },
      Limit: 10,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return {
        notifications: [],
        nextPage: null
      };
    }

    const notifications = items.map((item) => NotificationModelToEntityMapper.map(item));

    const lastEvaluatedKeyEncoded = result.LastEvaluatedKey ? this.encodeLastEvaluatedKey(result.LastEvaluatedKey) : null;

    return {
      notifications,
      nextPage: lastEvaluatedKeyEncoded
    };
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private encodeLastEvaluatedKey(lastEvaluatedKey: Record<string, any>): string {
    return Buffer.from(JSON.stringify(lastEvaluatedKey)).toString('base64');
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private decodeLastEvaluatedKey(encodedKey: string): Record<string, any> {
    return JSON.parse(Buffer.from(encodedKey, 'base64').toString('utf-8'));
  }
}
