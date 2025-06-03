import { Notification } from 'src/application/domain/entities/notification.entity';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ListNotificationsUsecase } from './list-notifications';
import { ListNotificationsInputDto } from './list-notifications.dto';

describe('list-notifications', () => {
  let listNotificationsUsecase: ListNotificationsUsecase;
  let listNotificationsInputDto: ListNotificationsInputDto;

  let notificationRepositoryMock: NotificationRepository;

  beforeEach(() => {
    notificationRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
      update: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    listNotificationsUsecase = new ListNotificationsUsecase(notificationRepositoryMock);

    listNotificationsInputDto = {
      accountId: 'accountId',
      page: 'page',
      status: 'created'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(listNotificationsUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should list notifications', async () => {
      const notification = Notification.create({
        accountId: 'accountId',
        payload: 'payload',
        notificationDate: 'notificationDate',
        destination: 'destination',
        notificationType: 'http'
      });

      notificationRepositoryMock.list = jest.fn().mockResolvedValueOnce({
        notifications: [notification],
        page: 'page'
      });

      await listNotificationsUsecase.execute({
        accountId: listNotificationsInputDto.accountId,
        page: listNotificationsInputDto.page
      });

      expect(notificationRepositoryMock.list).toHaveBeenCalledTimes(1);
      expect(notificationRepositoryMock.list).toHaveBeenCalledWith(listNotificationsInputDto.accountId, listNotificationsInputDto.page);
    });

    it('should list notifications by status', async () => {
      const notification = Notification.create({
        accountId: 'accountId',
        payload: 'payload',
        notificationDate: 'notificationDate',
        destination: 'destination',
        notificationType: 'HTTP'
      });

      notificationRepositoryMock.listByStatus = jest.fn().mockResolvedValueOnce({
        notifications: [notification],
        nextPage: 'nextPage'
      });

      await listNotificationsUsecase.execute({
        accountId: listNotificationsInputDto.accountId,
        page: listNotificationsInputDto.page,
        status: listNotificationsInputDto.status
      });

      expect(notificationRepositoryMock.listByStatus).toHaveBeenCalledTimes(1);
      expect(notificationRepositoryMock.listByStatus).toHaveBeenCalledWith(listNotificationsInputDto.accountId, listNotificationsInputDto.page, listNotificationsInputDto.status);
    });
  });
});
