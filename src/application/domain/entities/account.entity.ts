import { GenerateULID } from 'src/application/utils/generate-ulid';

type CreateDto = {
  name: string;
  email: string;
  document: string;
  password: string;
}

type WithDto = {
  id: string;
  name: string;
  email: string;
  document: string;
  password: string;
  httpNotificationQuantity: number;
  externalReference: string;
}

export class Account {
  private constructor (
    private id: string,
    private name: string,
    private email: string,
    private document: string,
    private password: string,
    private httpNotificationQuantity: number,
    private externalReference: string
  ) {}

  public static create({
    name,
    email,
    document,
    password,
  }: CreateDto): Account {
    const id = GenerateULID.generate();
    const httpNotificationQuantity = 0;
    const externalReference = '';

    return new Account(id, name, email, document, password, httpNotificationQuantity, externalReference);
  }

  public static with({
    id,
    name,
    email,
    document,
    password,
    httpNotificationQuantity,
    externalReference
  }: WithDto): Account {
    return new Account(id, name, email, document, password, httpNotificationQuantity, externalReference);
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

  public getDocument(): string {
    return this.document;
  }

  public getPassword(): string {
    return this.password;
  }

  public getHttpNotificationQuantity(): number {
    return this.httpNotificationQuantity;
  }

  public getExternalReference(): string {
    return this.externalReference;
  }

  public decreaseHttpNotifications() {
    if(this.httpNotificationQuantity === 0) {
      throw new Error('account without sufficient http notification');
    }

    this.httpNotificationQuantity -= 1;
  }

  public attachExternalReference(externalReference: string) {
    this.externalReference = externalReference;
  }
}
