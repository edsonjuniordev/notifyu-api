import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { CancelNotificationUsecase } from './cancel-notification';
import { CancelNotificationInputDto } from './cancel-notification.dto';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { Notification } from 'src/application/domain/entities/notification.entity';
import { Account } from 'src/application/domain/entities/account.entity';

describe('cancel-notification', () => {
  let cancelNotificationUsecase: CancelNotificationUsecase;
  let cancelNotificationInputDto: CancelNotificationInputDto;

  let notificationRepositoryMock: NotificationRepository;
  let accountRepositoryMock: AccountRepository;

  beforeEach(() => {
    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    notificationRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
      update: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    cancelNotificationUsecase = new CancelNotificationUsecase(notificationRepositoryMock, accountRepositoryMock);

    cancelNotificationInputDto = {
      notificationId: 'id',
      accountId: 'accountId',
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(cancelNotificationUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should cancel a notification', async () => {
      const notification = Notification.create({
        accountId: 'accountId',
        payload: 'payload',
        notificationDate: 'notificationDate',
        destination: 'destination',
        notificationType: 'HTTP',
      });

      const account = Account.create({
        name: 'name',
        email: 'email',
        document: 'document',
        password: 'password',
      });

      notificationRepositoryMock.findById = jest.fn().mockResolvedValueOnce(notification);
      accountRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValueOnce(account);

      await cancelNotificationUsecase.execute(cancelNotificationInputDto);

      expect(notificationRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(notificationRepositoryMock.findById).toHaveBeenCalledWith(cancelNotificationInputDto.notificationId, cancelNotificationInputDto.accountId);
      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledWith(notification.getAccountId());
    });

    it('should throw an error if the notification does not exist', async () => {
      await expect(cancelNotificationUsecase.execute(cancelNotificationInputDto)).rejects.toThrow(
        'notification not found',
      );

      expect(notificationRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(notificationRepositoryMock.findById).toHaveBeenCalledWith(cancelNotificationInputDto.notificationId, cancelNotificationInputDto.accountId);
    });
  });
});
