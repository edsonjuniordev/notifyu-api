import { PlanRepository } from 'src/application/repositories/plan.repository';
import { ListPlansOutputDto } from './list-plans.dto';

export class ListPlansUsecase {
  constructor(private readonly planRepository: PlanRepository) { }

  public async execute(): Promise<ListPlansOutputDto> {
    const plans = await this.planRepository.list();

    return {
      plans: plans.map((plan) => ({
        id: plan.getId(),
        name: plan.getName(),
        notificationQuantity: plan.getNotificationQuantity(),
        amount: plan.getAmount(),
        status: plan.getStatus().toString(),
      }))
    };
  }
}
