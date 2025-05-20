import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { ExpireOrderUsecase } from './expire-order';
import { ExpireOrderInputDto } from './expire-order.dto';

describe('expire-order', () => {
  let expireOrderUsecase: ExpireOrderUsecase;
  let expireOrderInputDto: ExpireOrderInputDto;

  let orderRepositoryMock: OrderRepository;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
    };

    expireOrderUsecase = new ExpireOrderUsecase(orderRepositoryMock);

    expireOrderInputDto = {
      orderId: 'orderId'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(expireOrderUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should expire an order', async () => {
      const order = Order.create({
        accountId: 'accountId',
        planId: 'planId',
        amount: 500,
        httpNotificationQuantity: 100,
      });

      orderRepositoryMock.findById = jest.fn().mockResolvedValueOnce(order);

      await expireOrderUsecase.execute(expireOrderInputDto);

      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
