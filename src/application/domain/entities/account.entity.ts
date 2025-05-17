import { GenerateULID } from 'src/application/utils/generate-ulid';

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
  httpNotificationQuantity: number;
}

export class Account {
  private constructor (
    private id: string,
    private name: string,
    private email: string,
    private password: string,
    private httpNotificationQuantity: number,
  ) {}

  public static create({
    name,
    email,
    password,
  }: CreateDto): Account {
    const id = GenerateULID.generate();
    const httpNotificationQuantity = 0;

    return new Account(id, name, email, password, httpNotificationQuantity);
  }

  public static with({
    id,
    name,
    email,
    password,
    httpNotificationQuantity,
  }: WithDto): Account {
    return new Account(id, name, email, password, httpNotificationQuantity);
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

  public getHttpNotificationQuantity(): number {
    return this.httpNotificationQuantity;
  }

  public decreaseHttpNotifications() {
    if(this.httpNotificationQuantity === 0) {
      throw new Error('account without sufficient http notification');
    }

    this.httpNotificationQuantity -= 1;
  }
}
