import { ApiKey } from '../domain/entities/api-key.entity';

export interface ApiKeyRepository {
  create(apiKey: ApiKey): Promise<void>;
  findById(id: string, accountId: string): Promise<ApiKey | null>;
  findByApiKey(apiKey: string): Promise<ApiKey | null>;
  listByAccountId(accountId: string): Promise<ApiKey[]>;
  delete(apiKey: string): Promise<void>;
}
