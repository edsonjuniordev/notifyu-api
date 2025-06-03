import { NotificationRepository } from 'src/application/repositories/notification.repository';
import { ProcessNotificationUsecase } from './process-notification';
import { ProcessNotificationInputDto } from './process-notification.dto';

global.fetch = jest.fn();

describe('process-notification', () => {
  let processNotificationUsecase: ProcessNotificationUsecase;
  let processNotificationInputDto: ProcessNotificationInputDto;

  let notificationRepositoryMock: NotificationRepository;

  beforeEach(() => {
    notificationRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      list: jest.fn().mockResolvedValueOnce([]),
      listByStatus: jest.fn().mockResolvedValueOnce([]),
      update: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    processNotificationUsecase = new ProcessNotificationUsecase(notificationRepositoryMock);

    processNotificationInputDto = {
      id: 'id',
      accountId: 'accountId',
      payload: 'payload',
      status: 'CREATED',
      notificationDate: 'notificationDate',
      destination: 'destination',
      notificationType: 'HTTP',
      createdAt: 'createdAt',
      updatedAt: 'updatedAt',
    };

    (fetch as jest.Mock).mockReset();
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(processNotificationUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should process notification with success', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: true,
      });

      await processNotificationUsecase.execute(processNotificationInputDto);

      expect(fetch).toHaveBeenCalled();
      expect(notificationRepositoryMock.update).toHaveBeenCalled();
    });

    it('should process notification with fail', async () => {
      (fetch as jest.Mock).mockResolvedValue({
        ok: false,
      });

      await processNotificationUsecase.execute(processNotificationInputDto);

      expect(fetch).toHaveBeenCalled();
      expect(notificationRepositoryMock.update).toHaveBeenCalled();
    });

    it('should process notification with error', async () => {
      (fetch as jest.Mock).mockRejectedValue(new Error('Network error'));

      await processNotificationUsecase.execute(processNotificationInputDto);

      expect(fetch).toHaveBeenCalled();
      expect(notificationRepositoryMock.update).toHaveBeenCalled();
    });
   });
});
