import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { PayOrderUsecase } from './pay-order';
import { PayOrderInputDto } from './pay-order.dto';

describe('pay-order', () => {
  let payOrderUsecase: PayOrderUsecase;
  let payOrderInputDto: PayOrderInputDto;

  let orderRepositoryMock: OrderRepository;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
    };

    payOrderUsecase = new PayOrderUsecase(orderRepositoryMock);

    payOrderInputDto = {
      orderId: 'orderId'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(payOrderUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should pay an order', async () => {
      const order = Order.create({
        accountId: 'accountId',
        planId: 'planId',
        amount: 500,
        httpNotificationQuantity: 100,
      });

      orderRepositoryMock.findById = jest.fn().mockResolvedValueOnce(order);

      await payOrderUsecase.execute(payOrderInputDto);

      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.update).toHaveBeenCalledTimes(1);
    });
   });
});
