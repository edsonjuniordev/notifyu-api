import { GenerateULID } from 'src/application/utils/generate-ulid';

export enum PlanStatus {
  ENABLED = 'ENABLED',
  DISABLED = 'DISABLED'
}

type CreateDto = {
  name: string;
  notificationQuantity: number;
  amount: number;
}

type WithDto = {
  id: string;
  name: string;
  notificationQuantity: number;
  amount: number;
  status: string;
}

export class Plan {
  private constructor(
    private id: string,
    private name: string,
    private notificationQuantity: number,
    private amount: number,
    private status: PlanStatus
  ) {}

  public static create({
    name,
    notificationQuantity,
    amount
  }: CreateDto): Plan {
    const id = GenerateULID.generate();

    return new Plan(
      id,
      name,
      notificationQuantity,
      amount,
      PlanStatus.ENABLED
    );
  }

  public static with({
    id,
    name,
    notificationQuantity,
    amount,
    status
  }: WithDto): Plan {
    return new Plan(
      id,
      name,
      notificationQuantity,
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

  public getNotificationQuantity(): number {
    return this.notificationQuantity;
  }

  public getAmount(): number {
    return this.amount;
  }

  public getStatus(): PlanStatus {
    return this.status;
  }
}
