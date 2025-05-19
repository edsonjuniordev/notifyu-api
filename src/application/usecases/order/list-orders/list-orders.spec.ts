import { Order } from 'src/application/domain/entities/order.entity';
import { OrderRepository } from 'src/application/repositories/order.repository';
import { ListOrdersUsecase } from './list-orders';
import { ListOrdersInputDto } from './list-orders.dto';

describe('list-orders', () => {
  let listOrdersUsecase: ListOrdersUsecase;
  let listOrdersInputDto: ListOrdersInputDto;

  let orderRepositoryMock: OrderRepository;

  beforeEach(() => {
    orderRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
    };

    listOrdersUsecase = new ListOrdersUsecase(orderRepositoryMock);

    listOrdersInputDto = {
      accountId: 'accountId',
      page: 'page',
      status: 'pending'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(listOrdersUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should list orders', async () => {
      const order = Order.create({
        accountId: 'accountId',
        planId: 'planId',
        amount: 500,
        httpNotificationQuantity: 1,
      });

      orderRepositoryMock.list = jest.fn().mockResolvedValueOnce({
        orders: [order],
        page: 'page'
      });

      await listOrdersUsecase.execute({
        accountId: listOrdersInputDto.accountId,
        page: listOrdersInputDto.page
      });

      expect(orderRepositoryMock.list).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.list).toHaveBeenCalledWith(listOrdersInputDto.accountId, listOrdersInputDto.page);
    });

    it('should list orders by status', async () => {
      const order = Order.create({
        accountId: 'accountId',
        planId: 'planId',
        amount: 500,
        httpNotificationQuantity: 1,
      });

      orderRepositoryMock.listByStatus = jest.fn().mockResolvedValueOnce({
        orders: [order],
        nextPage: 'nextPage'
      });

      await listOrdersUsecase.execute({
        accountId: listOrdersInputDto.accountId,
        page: listOrdersInputDto.page,
        status: listOrdersInputDto.status
      });

      expect(orderRepositoryMock.listByStatus).toHaveBeenCalledTimes(1);
      expect(orderRepositoryMock.listByStatus).toHaveBeenCalledWith(listOrdersInputDto.accountId, listOrdersInputDto.page, listOrdersInputDto.status);
    });
  });
});
