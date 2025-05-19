import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { GSI1_INDEX_NAME, TABLE_NAME } from '../../dynamo-client';
import { OrderEntityToModelMapper } from './mappers/order-entity-to-model.mapper';
import { OrderModelToEntityMapper } from './mappers/order-model-to-entity.mapper';

export class DynamoOrderRepository implements OrderRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(order: Order): Promise<void> {
    const command = OrderEntityToModelMapper.map(order);

    await this.dynamoClient.send(command);
  }

  public async list(accountId: string, page: string): Promise<{ orders: Order[]; nextPage: string; }> {
    const lastEvaluatedKey = page ? this.decodeLastEvaluatedKey(page) : undefined;

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk',
      ExpressionAttributeValues: {
        ':pk': `ORDER#${accountId}`,
      },
      Limit: 10,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return {
        orders: [],
        nextPage: null
      };
    }

    const orders = items.map((item) => OrderModelToEntityMapper.map(item));

    const lastEvaluatedKeyEncoded = result.LastEvaluatedKey ? this.encodeLastEvaluatedKey(result.LastEvaluatedKey) : null;

    return {
      orders,
      nextPage: lastEvaluatedKeyEncoded
    };
  }

  public async listByStatus(accountId: string, page: string, status: string): Promise<{ orders: Order[]; nextPage: string; }> {
    const lastEvaluatedKey = page ? this.decodeLastEvaluatedKey(page) : undefined;

    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk AND begins_with(SK, :sk)',
      ExpressionAttributeValues: {
        ':pk': `ORDER#${accountId}`,
        ':sk': `ORDER#${status.toUpperCase()}`
      },
      Limit: 10,
      ExclusiveStartKey: lastEvaluatedKey,
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return {
        orders: [],
        nextPage: null
      };
    }

    const orders = items.map((item) => OrderModelToEntityMapper.map(item));

    const lastEvaluatedKeyEncoded = result.LastEvaluatedKey ? this.encodeLastEvaluatedKey(result.LastEvaluatedKey) : null;

    return {
      orders,
      nextPage: lastEvaluatedKeyEncoded
    };
  }

  public async findById(orderId: string): Promise<Order | null> {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_INDEX_NAME,
      KeyConditionExpression: 'GSI1PK = :pk and GSI1SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `ORDER#${orderId}`,
        ':sk': `ORDER#${orderId}`,
      }
    });

    const result = await this.dynamoClient.send(queryCommand);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const order = OrderModelToEntityMapper.map(items[0]);

    return order;
  }

  public async update(order: Order): Promise<void> {
    const command = OrderEntityToModelMapper.map(order);

    await this.dynamoClient.send(command);
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
