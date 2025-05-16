import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { ListApiKeysInputDto, ListApiKeysOutputDto } from './list-api-keys.dto';

export class ListApiKeysUsecase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) { }

  public async execute(input: ListApiKeysInputDto): Promise<ListApiKeysOutputDto> {
    const apiKeys = await this.apiKeyRepository.listByAccountId(input.accountId);

    const maskedApiKeys = apiKeys.map((apiKey) => ({
      id: apiKey.getId(),
      apiKey: apiKey.getApiKey() && this.maskApiKey(apiKey.getApiKey())
    }));

    return {
      apiKeys: maskedApiKeys
    };
  }

  private maskApiKey(apiKey: string): string {
    const visibleLength = Math.ceil(apiKey.length / 2);
    const maskedLength = apiKey.length - visibleLength;

    return apiKey.substring(0, visibleLength) + '*'.repeat(maskedLength);
  }
}
