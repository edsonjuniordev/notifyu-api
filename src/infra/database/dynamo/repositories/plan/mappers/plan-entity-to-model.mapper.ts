import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Plan } from 'src/application/domain/entities/plan.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class PlanEntityToModelMapper {
  public static map(plan: Plan): PutCommand {
    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: 'PLAN',
        SK: `PLAN#${plan.getId()}`,
        GSI1PK: `PLAN#${plan.getStatus().toString()}`,
        GSI1SK: `PLAN#${plan.getId()}`,
        type: 'PLAN',
        id: plan.getId(),
        name: plan.getName(),
        notificationQuantity: plan.getNotificationQuantity(),
        status: plan.getStatus().toString(),
      },
    });
  }
}
