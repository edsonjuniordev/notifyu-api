import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { dynamoClient, GSI1_INDEX_NAME, GSI2_INDEX_NAME, TABLE_NAME } from '../../dynamo-client';
import { NotificationEntityToModelMapper } from './mappers/notification-entity-to-model.mapper';
import { NotificationModelToEntityMapper } from './mappers/notification-model-to-entity.mapper';

export class DynamoNotificationRepository implements NotificationRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(notification: Notification): Promise<void> {
    const command = NotificationEntityToModelMapper.map(notification);

    await this.dynamoClient.send(command);
  }

  public async update(notification: Notification): Promise<void> {
    const command = NotificationEntityToModelMapper.map(notification);

    await this.dynamoClient.send(command);
  }

  public async findById(notificationId: string, accountId: string): Promise<Notification | null> {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `NOTIFICATION#${accountId}`,
        ':sk': `NOTIFICATION#${notificationId}`,
      }
    });

    const result = await this.dynamoClient.send(queryCommand);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const notification = NotificationModelToEntityMapper.map(items[0]);

    return notification;
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
      ScanIndexForward: false
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
      IndexName: GSI1_INDEX_NAME,
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `NOTIFICATION#${accountId}`,
        ':sk': `NOTIFICATION#${status.toUpperCase()}`
      },
      Limit: 10,
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false
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

  public async listByNotificationDateAndStatusCreated(page: string, notificationDate: string): Promise<{ notifications: Notification[]; nextPage: string; }> {
    const lastEvaluatedKey = page ? this.decodeLastEvaluatedKey(page) : undefined;

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI2_INDEX_NAME,
      KeyConditionExpression: 'GSI2PK = :pk AND GSI2SK = :sk',
      ExpressionAttributeValues: {
        ':pk': 'NOTIFICATION',
        ':sk': `NOTIFICATION#${notificationDate}#CREATED`
      },
      ExclusiveStartKey: lastEvaluatedKey,
      ScanIndexForward: false
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

export const dynamoNotificationRepository = new DynamoNotificationRepository(dynamoClient);
