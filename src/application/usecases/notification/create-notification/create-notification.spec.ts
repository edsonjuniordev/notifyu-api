import { AccountRepository } from 'src/application/repositories/account.repository';
import { CreateNotificationUsecase } from './create-notification';
import { CreateNotificationInputDto } from './create-notification.dto';
import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { Account } from 'src/application/domain/entities/account.entity';

describe('create-notification', () => {
  let createNotificationUsecase: CreateNotificationUsecase;
  let createNotificationInputDto: CreateNotificationInputDto;

  let accountRepositoryMock: AccountRepository;
  let notificationRepositoryMock: NotificationRepository;

  beforeEach(() => {
    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
    };

    notificationRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
    };

    createNotificationUsecase = new CreateNotificationUsecase(accountRepositoryMock, notificationRepositoryMock);

    createNotificationInputDto = {
      accountId: 'any-account-id',
      payload: 'payload',
      notificationDate: new Date().toISOString(),
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(createNotificationUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create a notification', async () => {
      const account = Account.with({
        id: createNotificationInputDto.accountId,
        name: 'name',
        email: 'email',
        password: 'password',
        notificationQuantity: 1,
      });

      accountRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValueOnce(account);

      await createNotificationUsecase.execute(createNotificationInputDto);

      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledWith(createNotificationInputDto.accountId);
      expect(notificationRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if account not exists', async () => {
      await expect(createNotificationUsecase.execute(createNotificationInputDto)).rejects.toThrow(
        'account not found',
      );

      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledWith(createNotificationInputDto.accountId);
    });

    it('should throw an error if account not have notifications', async () => {
      const account = Account.with({
        id: createNotificationInputDto.accountId,
        name: 'name',
        email: 'email',
        password: 'password',
        notificationQuantity: 0,
      });

      accountRepositoryMock.findByIdAndLock = jest.fn().mockResolvedValueOnce(account);

      await expect(createNotificationUsecase.execute(createNotificationInputDto)).rejects.toThrow(
        'account without sufficient notification',
      );

      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByIdAndLock).toHaveBeenCalledWith(createNotificationInputDto.accountId);
    });
  });
});
