import { PlanRepository } from 'src/application/repositories/plan.repository';
import { CreatePlanUsecase } from './create-plan';
import { CreatePlanInputDto } from './create-plan.dto';

describe('create-plan', () => {
  let createPlanUsecase: CreatePlanUsecase;
  let createPlanInputDto: CreatePlanInputDto;

  let planRepository: PlanRepository;

  beforeEach(() => {
    planRepository = {
      create: jest.fn().mockResolvedValueOnce(null)
    };

    createPlanUsecase = new CreatePlanUsecase(planRepository);

    createPlanInputDto = {
      name: 'name',
      notificationQuantity: 1,
      amount: 1
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(createPlanUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create a plan', async () => {
      await createPlanUsecase.execute(createPlanInputDto);

      expect(planRepository.create).toHaveBeenCalledTimes(1);
    });
  });
});
