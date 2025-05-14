import { GenerateUUID } from 'src/application/utils/generate-uuid';

type CreateDto = {
  name: string;
  email: string;
  password: string;
}

type WithDto = {
  id: string;
  name: string;
  email: string;
  password: string;
  notificationQuantity: number;
}

export class Account {
  private constructor (
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private notificationQuantity: number,
  ) {}

  public static create({
    name,
    email,
    password,
  }: CreateDto): Account {
    const id = GenerateUUID.generate();
    const notificationQuantity = 0;

    return new Account(id, name, email, password, notificationQuantity);
  }

  public static with({
    id,
    name,
    email,
    password,
    notificationQuantity,
  }: WithDto): Account {
    return new Account(id, name, email, password, notificationQuantity);
  }

  public getId(): string {
    return this.id;
  }

  public getName(): string {
    return this.name;
  }

  public getEmail(): string {
    return this.email;
  }

  public getPassword(): string {
    return this.password;
  }

  public getNotificationQuantity(): number {
    return this.notificationQuantity;
  }

  public decreaseNotifications() {
    if(this.notificationQuantity === 0) {
      throw new Error('account without sufficient notification');
    }

    this.notificationQuantity -= 1;
  }
}
