import { GenerateULID } from 'src/application/utils/generate-ulid';

type CreateDto = {
  accountId: string;
}

type WithDto = {
  id: string;
  accountId: string;
  apiKey: string;
}

export class ApiKey {
  private constructor(
    private id: string,
    private accountId: string,
    private apiKey: string,
  ) { }

  public static create({
    accountId,
  }: CreateDto): ApiKey {
    const id = GenerateULID.generate();

    const apiKey = GenerateULID.generate();

    return new ApiKey(id, accountId, apiKey);
  }

  public static with({
    id,
    accountId,
    apiKey,
  }: WithDto): ApiKey {
    return new ApiKey(id, accountId, apiKey);
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
}
