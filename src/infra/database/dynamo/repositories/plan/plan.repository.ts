import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Plan } from 'src/application/domain/entities/plan.entity';
import { PlanRepository } from 'src/application/repositories/plan.repository';
import { PlanEntityToModelMapper } from './mappers/plan-entity-to-model.mapper';
import { GSI1_INDEX_NAME, TABLE_NAME } from '../../dynamo-client';
import { PlanModelToEntityMapper } from './mappers/plan-model-to-entity.mapper';

export class DynamoPlanRepository implements PlanRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(plan: Plan): Promise<void> {
    const command = PlanEntityToModelMapper.map(plan);

    await this.dynamoClient.send(command);
  }

  public async findById(planId: string): Promise<Plan | null> {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': 'PLAN',
        ':sk': `PLAN#${planId}`,
      }
    });

    const result = await this.dynamoClient.send(queryCommand);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const plan = PlanModelToEntityMapper.map(items[0]);

    return plan;
  }

  public async list(): Promise<Plan[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_INDEX_NAME,
      KeyConditionExpression: 'GSI1PK = :pk',
      ExpressionAttributeValues: {
        ':pk': 'PLAN#ENABLED',
      },
      ScanIndexForward: false
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return [];
    }

    const plans = items.map((item) => PlanModelToEntityMapper.map(item));

    return plans;
  }
}
