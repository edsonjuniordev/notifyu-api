import { GenerateULID } from 'src/application/utils/generate-ulid';

export enum OrderStatus {
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  PAID = 'PAID'
}

type CreateDto = {
  accountId: string;
  planId: string;
  amount: number;
  httpNotificationQuantity: number;
}

type WithDto = {
  id: string;
  accountId: string;
  planId: string;
  amount: number;
  httpNotificationQuantity: number;
  status: string;
  createdAt: string;
  updatedAt: string;
  externalId?: string;
  invoiceUrl?: string;
}

export class Order {
  private constructor(
    private id: string,
    private accountId: string,
    private planId: string,
    private amount: number,
    private httpNotificationQuantity: number,
    private status: OrderStatus,
    private createdAt: string,
    private updatedAt: string,
    private externalId?: string,
    private invoiceUrl?: string
  ) { }

  public static create({
    accountId,
    planId,
    amount,
    httpNotificationQuantity,
  }: CreateDto): Order {
    const id = GenerateULID.generate();
    const status = OrderStatus.PENDING;
    const now = new Date().toISOString();

    return new Order(id, accountId, planId, amount, httpNotificationQuantity, status, now, now);
  }

  public static with({
    id,
    accountId,
    planId,
    amount,
    httpNotificationQuantity,
    status,
    createdAt,
    updatedAt,
    externalId,
    invoiceUrl
  }: WithDto): Order {
    return new Order(
      id,
      accountId,
      planId,
      amount,
      httpNotificationQuantity,
      OrderStatus[status],
      createdAt,
      updatedAt,
      externalId,
      invoiceUrl
    );
  }

  public getId(): string {
    return this.id;
  }

  public getAccountId(): string {
    return this.accountId;
  }

  public getPlanId(): string {
    return this.planId;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getHttpNotificationQuantity(): number {
    return this.httpNotificationQuantity;
  }

  public getStatus(): OrderStatus {
    return this.status;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }

  public getExternalId(): string {
    return this.externalId;
  }

  public getInvoiceUrl(): string {
    return this.invoiceUrl;
  }

  private update() {
    this.updatedAt = new Date().toISOString();
  }

  public addExternalId(externalId: string) {
    this.externalId = externalId;
    this.update();
  }

  public addInvoiceUrl(invoiceUrl: string) {
    this.invoiceUrl = invoiceUrl;
    this.update();
  }

  public pay() {
    if (this.status !== OrderStatus.PENDING && this.status !== OrderStatus.EXPIRED) {
      throw new Error(`unable to update status because it is different from ${OrderStatus.PENDING} and ${OrderStatus.EXPIRED}`);
    }
    this.status = OrderStatus.PAID;
    this.update();
  }

  public expire() {
    if (this.status !== OrderStatus.PENDING) {
      throw new Error(`unable to update status because it is different from ${OrderStatus.PENDING}`);
    }
    this.status = OrderStatus.EXPIRED;
    this.update();
  }
}
