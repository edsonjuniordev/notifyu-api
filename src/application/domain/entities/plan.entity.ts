import { GenerateULID } from 'src/application/utils/generate-ulid';

export enum PlanStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

type CreateDto = {
  name: string;
  httpNotificationQuantity: number;
  amount: number;
}

type WithDto = {
  id: string;
  name: string;
  httpNotificationQuantity: number;
  amount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export class Plan {
  private constructor(
    private id: string,
    private name: string,
    private httpNotificationQuantity: number,
    private amount: number,
    private status: PlanStatus,
    private createdAt: string,
    private updatedAt: string
  ) { }

  public static create({
    name,
    httpNotificationQuantity,
    amount
  }: CreateDto): Plan {
    const id = GenerateULID.generate();
    const now = new Date().toISOString();

    return new Plan(
      id,
      name,
      httpNotificationQuantity,
      amount,
      PlanStatus.ENABLED,
      now,
      now
    );
  }

  public static with({
    id,
    name,
    httpNotificationQuantity,
    amount,
    status,
    createdAt,
    updatedAt
  }: WithDto): Plan {
    return new Plan(
      id,
      name,
      httpNotificationQuantity,
      amount,
      PlanStatus[status],
      createdAt,
      updatedAt
    );
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getHttpNotificationQuantity(): number {
    return this.httpNotificationQuantity;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getStatus(): PlanStatus {
    return this.status;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }
}
