import { ApiKey } from '../domain/entities/api-key.entity';

export interface ApiKeyRepository {
  create(apiKey: ApiKey): Promise<void>;
  findByApiKey(apiKey: string): Promise<ApiKey | null>;
  listByAccountId(accountId: string): Promise<ApiKey[]>;
}
