import { GenerateUUID } from 'src/application/utils/generate-uuid';

export enum NotificationStatus {
  CREATED = 'CREATED',
  NOTIFIED = 'NOTIFIED',
  FAILED = 'FAILED'
}

type CreateDto = {
  accountId: string;
  payload: string;
  notificationDate: string;
}

type WithDto = {
  id: string;
  accountId: string;
  payload: string;
  status: string;
  notificationDate: string;
  createdAt: string;
  updatedAt: string;
}

export class Notification {
  private constructor(
    private id: string,
    private accountId: string,
    private payload: string,
    private status: NotificationStatus,
    private notificationDate: string,
    private createdAt: string,
    private updatedAt: string
  ) { }

  public static create({
    accountId,
    payload,
    notificationDate,
  }: CreateDto): Notification {
    const id = GenerateUUID.generate();

    const status = NotificationStatus.CREATED;

    const now = new Date().toISOString();

    return new Notification(
      id,
      accountId,
      payload,
      status,
      notificationDate,
      now,
      now
    );
  }

  public static with({
    id,
    accountId,
    payload,
    status,
    notificationDate,
    createdAt,
    updatedAt,
  }: WithDto): Notification {
    return new Notification(
      id,
      accountId,
      payload,
      NotificationStatus[status],
      notificationDate,
      createdAt,
      updatedAt
    );
  }

  public getId(): string {
    return this.id;
  }

  public getAccountId(): string {
    return this.accountId;
  }

  public getPayload(): string {
    return this.payload;
  }

  public getStatus(): NotificationStatus {
    return this.status;
  }

  public getNotificationDate(): string {
    return this.notificationDate;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }
}
