import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { OrderEntityToModelMapper } from './mappers/order-entity-to-model.mapper';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

export class DynamoOrderRepository implements OrderRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(order: Order): Promise<void> {
    const command = OrderEntityToModelMapper.map(order);

    await this.dynamoClient.send(command);
  }
}
