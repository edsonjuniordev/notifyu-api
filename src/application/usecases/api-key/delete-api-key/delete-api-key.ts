import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { DeleteApiKeyInputDto } from './delete-api-key.dto';

export class DeleteApiKeyUsecase {
  constructor(private readonly apiKeyRepository: ApiKeyRepository) {}

  public async execute(input: DeleteApiKeyInputDto): Promise<void> {
    const apiKey = await this.apiKeyRepository.findById(input.id, input.accountId);

    if (!apiKey) {
      return;
    }

    await this.apiKeyRepository.delete(apiKey.getApiKey());
  }
}
