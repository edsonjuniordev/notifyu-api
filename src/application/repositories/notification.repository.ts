import { Notification } from '../domain/entities/notification.entity';

export interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  list(accountId: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
}
