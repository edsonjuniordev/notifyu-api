import { GenerateULID } from 'src/application/utils/generate-ulid';

export enum NotificationStatus {
  CREATED = 'CREATED',
  NOTIFIED = 'NOTIFIED',
  FAILED = 'FAILED'
}

type CreateDto = {
  accountId: string;
  payload: unknown;
  notificationDate: string;
  destination: string;
}

type WithDto = {
  id: string;
  accountId: string;
  payload: unknown;
  status: string;
  notificationDate: string;
  destination: string;
  createdAt: string;
  updatedAt: string;
}

export class Notification {
  private constructor(
    private id: string,
    private accountId: string,
    private payload: unknown,
    private status: NotificationStatus,
    private notificationDate: string,
    private destination: string,
    private createdAt: string,
    private updatedAt: string
  ) { }

  public static create({
    accountId,
    payload,
    notificationDate,
    destination
  }: CreateDto): Notification {
    const id = GenerateULID.generate();

    const status = NotificationStatus.CREATED;

    const now = new Date().toISOString();

    return new Notification(
      id,
      accountId,
      payload,
      status,
      notificationDate,
      destination,
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
    destination,
    createdAt,
    updatedAt,
  }: WithDto): Notification {
    return new Notification(
      id,
      accountId,
      payload,
      NotificationStatus[status],
      notificationDate,
      destination,
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

  public getPayload(): unknown {
    return this.payload;
  }

  public getStatus(): NotificationStatus {
    return this.status;
  }

  public getNotificationDate(): string {
    return this.notificationDate;
  }

  public getDestination(): string {
    return this.destination;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public notify() {
    if (this.status !== NotificationStatus.CREATED) {
      throw new Error(`unable to update status because it is different from ${NotificationStatus.CREATED}`);
    }

    this.status = NotificationStatus.NOTIFIED;
    this.update();
  }

  public failed() {
    if (this.status !== NotificationStatus.CREATED) {
      throw new Error(`unable to update status because it is different from ${NotificationStatus.CREATED}`);
    }

    this.status = NotificationStatus.FAILED;
    this.update();
  }

  private update() {
    this.updatedAt = new Date().toISOString();
  }
}
