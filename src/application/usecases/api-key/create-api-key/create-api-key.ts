import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { CreateApiKeyInputDto, CreateApiKeyOutputDto } from './create-api-key.dto';
import { ApiKey } from 'src/application/domain/entities/api-key.entity';

export class CreateApiKeyUsecase {
  constructor(
    private readonly apiKeyRepostory: ApiKeyRepository
  ) {}

  public async execute(input: CreateApiKeyInputDto): Promise<CreateApiKeyOutputDto> {
    const apiKey = ApiKey.create({
      accountId: input.accountId
    });

    await this.apiKeyRepostory.create(apiKey);

    return {
      apiKey: apiKey.getApiKey(),
    };
  }
}
