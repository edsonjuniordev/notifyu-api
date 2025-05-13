import { GenerateUUID } from 'src/application/utils/generate-uuid';

type CreateDto = {
  accountId: string;
}

type WithDto = {
  id: string;
  accountId: string;
  apiKey: string;
}

export class ApiKey {
  constructor(
    private id: string,
    private accountId: string,
    private apiKey: string,
  ) { }

  public static create({
    accountId,
  }: CreateDto): ApiKey {
    const id = GenerateUUID.generate();

    const apiKey = GenerateUUID.generate();

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
