import { Notification } from '../domain/entities/notification.entity';

export interface NotificationRepository {
  create(notification: Notification): Promise<void>;
  findById(notificationId: string, accountId: string): Promise<Notification | null>;
  update(notification: Notification): Promise<void>;
  list(accountId: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
  listByNotificationDate(accountId: string, notificationDate: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
  listByNotificationDateAndStatus(accountId: string, notificationDate: string, status: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
  listByStatus(accountId: string, status: string, page: string): Promise<{
    notifications: Notification[];
    nextPage: string;
  }>
}
