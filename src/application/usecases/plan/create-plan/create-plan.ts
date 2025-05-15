import { PlanRepository } from 'src/application/repositories/plan.repository';
import { CreatePlanInputDto, CreatePlanOutputDto } from './create-plan.dto';
import { Plan } from 'src/application/domain/entities/plan.entity';

export class CreatePlanUsecase {
  constructor(private readonly planRepository: PlanRepository) { }

  public async execute(input: CreatePlanInputDto): Promise<CreatePlanOutputDto> {
    const plan = Plan.create({
      name: input.name,
      notificationQuantity: input.notificationQuantity,
      amount: input.amount,
    });

    await this.planRepository.create(plan);

    return {
      id: plan.getId(),
      name: plan.getName(),
      notificationQuantity: plan.getNotificationQuantity(),
      amount: plan.getAmount(),
    };
  }
}
