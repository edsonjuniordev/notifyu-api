import { Notification } from '../domain/entities/notification.entity';

export interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  list(accountId: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
  listByStatus(accountId: string, page: string, status: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
}
