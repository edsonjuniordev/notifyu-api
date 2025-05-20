import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { PayOrderUsecase } from './pay-order';
import { PayOrderInputDto } from './pay-order.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { Account } from 'src/application/domain/entities/account.entity';

describe('pay-order', () => {
  let payOrderUsecase: PayOrderUsecase;
  let payOrderInputDto: PayOrderInputDto;

  let orderRepositoryMock: OrderRepository;
  let accountRepositoryMock: AccountRepository;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
    };

    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    payOrderUsecase = new PayOrderUsecase(orderRepositoryMock, accountRepositoryMock);

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

      const account = Account.create({
        name: 'name',
        email: 'email',
        document: 'document',
        password: 'password',
      });

      orderRepositoryMock.findById = jest.fn().mockResolvedValueOnce(order);
      accountRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValueOnce(account);

      await payOrderUsecase.execute(payOrderInputDto);

      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.update).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.update).toHaveBeenCalledTimes(1);
    });
  });
});
