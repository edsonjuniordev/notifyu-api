import { PlanRepository } from 'src/application/repositories/plan.repository';
import { CreatePlanUsecase } from './create-plan';
import { CreatePlanInputDto } from './create-plan.dto';

describe('create-plan', () => {
  let createPlanUsecase: CreatePlanUsecase;
  let createPlanInputDto: CreatePlanInputDto;

  let planRepositoryMock: PlanRepository;

  beforeEach(() => {
    planRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      findById: jest.fn().mockResolvedValueOnce(null)
    };

    createPlanUsecase = new CreatePlanUsecase(planRepositoryMock);

    createPlanInputDto = {
      name: 'name',
      httpNotificationQuantity: 1,
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

      expect(planRepositoryMock.create).toHaveBeenCalledTimes(1);
    });
  });
});
