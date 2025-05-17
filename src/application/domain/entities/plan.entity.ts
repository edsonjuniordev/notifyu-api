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
}

export class Plan {
  private constructor(
    private id: string,
    private name: string,
    private httpNotificationQuantity: number,
    private amount: number,
    private status: PlanStatus
  ) {}

  public static create({
    name,
    httpNotificationQuantity,
    amount
  }: CreateDto): Plan {
    const id = GenerateULID.generate();

    return new Plan(
      id,
      name,
      httpNotificationQuantity,
      amount,
      PlanStatus.ENABLED
    );
  }

  public static with({
    id,
    name,
    httpNotificationQuantity,
    amount,
    status
  }: WithDto): Plan {
    return new Plan(
      id,
      name,
      httpNotificationQuantity,
      amount,
      PlanStatus[status]
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
}
