import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Plan } from 'src/application/domain/entities/plan.entity';
import { PlanRepository } from 'src/application/repositories/plan.repository';
import { PlanEntityToModelMapper } from './mappers/plan-entity-to-model.mapper';

export class DynamoPlanRepository implements PlanRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(plan: Plan): Promise<void> {
    const command = PlanEntityToModelMapper.map(plan);

    await this.dynamoClient.send(command);
  }
}
