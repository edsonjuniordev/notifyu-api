import { PlanRepository } from 'src/application/repositories/plan.repository';
import { ListPlansUsecase } from './list-plans';

describe('list-plan', () => {
  let listPlanUsecase: ListPlansUsecase;

  let planRepository: PlanRepository;

  beforeEach(() => {
    planRepository = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
    };

    listPlanUsecase = new ListPlansUsecase(planRepository);
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(listPlanUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create a plan', async () => {
      await listPlanUsecase.execute();

      expect(planRepository.list).toHaveBeenCalledTimes(1);
    });
  });
});
