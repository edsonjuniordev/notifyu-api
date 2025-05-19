import { OrderRepository } from 'src/application/repositories/order.repository';
import { CreateOrderUsecase } from './create-order';
import { CreateOrderInputDto } from './create-order.dto';
import { PaymentService } from 'src/application/services/payment-service';
import { PlanRepository } from 'src/application/repositories/plan.repository';
import { Plan } from 'src/application/domain/entities/plan.entity';

describe('create-order', () => {
  let createOrderUsecase: CreateOrderUsecase;
  let createOrderInputDto: CreateOrderInputDto;

  let orderRepositoryMock: OrderRepository;
  let planRepositoryMock: PlanRepository;
  let paymnetServiceMock: PaymentService;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
    };
    planRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      findById: jest.fn().mockResolvedValueOnce(null)
    };
    paymnetServiceMock = {
      createAccount: jest.fn().mockResolvedValueOnce(null),
      createOrder: jest.fn().mockResolvedValueOnce(null)
    };

    createOrderUsecase = new CreateOrderUsecase(orderRepositoryMock, planRepositoryMock, paymnetServiceMock);

    createOrderInputDto = {
      accountId: 'id',
      planId: 'id'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(createOrderUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create an order', async () => {
      const plan = Plan.create({
        name: 'name',
        httpNotificationQuantity: 1,
        amount: 1
      });

      planRepositoryMock.findById = jest.fn().mockResolvedValueOnce(plan);
      paymnetServiceMock.createOrder = jest.fn().mockResolvedValueOnce({
        externalId: 'externalId',
        invoiceUrl: 'invoiceUrl'
      });

      await createOrderUsecase.execute(createOrderInputDto);

      expect(planRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(planRepositoryMock.findById).toHaveBeenCalledWith(createOrderInputDto.planId);
      expect(paymnetServiceMock.createOrder).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.create).toHaveBeenCalledTimes(1);

    });
   });
});
