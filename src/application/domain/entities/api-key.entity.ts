import { GenerateULID } from 'src/application/utils/generate-ulid';

type CreateDto = {
  accountId: string;
}

type WithDto = {
  id: string;
  accountId: string;
  apiKey: string;
  createdAt: string;
  updatedAt: string;
}

export class ApiKey {
  private constructor(
    private id: string,
    private accountId: string,
    private apiKey: string,
    private createdAt: string,
    private updatedAt: string
  ) { }

  public static create({
    accountId,
  }: CreateDto): ApiKey {
    const id = GenerateULID.generate();
    const apiKey = GenerateULID.generate();
    const now = new Date().toISOString();

    return new ApiKey(id, accountId, apiKey, now, now);
  }

  public static with({
    id,
    accountId,
    apiKey,
    createdAt,
    updatedAt
  }: WithDto): ApiKey {
    return new ApiKey(id, accountId, apiKey, createdAt, updatedAt);
  }

  public getId(): string {
    return this.id;
  }

  public getAccountId(): string {
    return this.accountId;
  }

  public getApiKey(): string {
    return this.apiKey;
  }

  public getCreatedAt(): string {
    return this.createdAt;
  }

  public getUpdatedAt(): string {
    return this.updatedAt;
  }
}
