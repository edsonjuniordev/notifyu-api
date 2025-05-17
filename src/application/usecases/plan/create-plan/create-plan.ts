import { PlanRepository } from 'src/application/repositories/plan.repository';
import { CreatePlanInputDto, CreatePlanOutputDto } from './create-plan.dto';
import { Plan } from 'src/application/domain/entities/plan.entity';

export class CreatePlanUsecase {
  constructor(private readonly planRepository: PlanRepository) { }

  public async execute(input: CreatePlanInputDto): Promise<CreatePlanOutputDto> {
    const plan = Plan.create({
      name: input.name,
      httpNotificationQuantity: input.httpNotificationQuantity,
      amount: input.amount,
    });

    await this.planRepository.create(plan);

    return {
      id: plan.getId(),
      name: plan.getName(),
      httpNotificationQuantity: plan.getHttpNotificationQuantity(),
      amount: plan.getAmount(),
    };
  }
}
