import { Plan } from 'src/application/domain/entities/plan.entity';

export class PlanModelToEntityMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static map(model: any): Plan {
    return Plan.with({
      id: model.id,
      name: model.name,
      notificationQuantity: model.notificationQuantity,
      amount: model.amount,
      status: model.status,
    });
  }
}
