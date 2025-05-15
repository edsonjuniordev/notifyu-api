import { Plan } from '../domain/entities/plan.entity';

export interface PlanRepository {
  create(plan: Plan): Promise<void>;
}
