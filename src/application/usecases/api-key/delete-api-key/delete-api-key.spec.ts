import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { DeleteApiKeyUsecase } from './delete-api-key';
import { DeleteApiKeyInputDto } from './delete-api-key.dto';
import { ApiKey } from 'src/application/domain/entities/api-key.entity';

describe('delete-api-key', () => {
  let deleteApiKeyUsecase: DeleteApiKeyUsecase;
  let deleteApiKeyInputDto: DeleteApiKeyInputDto;

  let apiKeyRepositoryMock: ApiKeyRepository;

  beforeEach(() => {
    apiKeyRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      findByApiKey: jest.fn().mockResolvedValueOnce(null),
      listByAccountId: jest.fn().mockResolvedValueOnce([]),
      delete: jest.fn().mockResolvedValueOnce(null),
    };

    deleteApiKeyUsecase = new DeleteApiKeyUsecase(apiKeyRepositoryMock);

    deleteApiKeyInputDto = {
      id: 'any_id',
      accountId: 'any_account_id'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(deleteApiKeyUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should delete an api key', async () => {
      const apiKey1 = ApiKey.create({
        accountId: 'account-id',
      });
      apiKeyRepositoryMock.findById = jest.fn().mockResolvedValueOnce(apiKey1);

      await deleteApiKeyUsecase.execute(deleteApiKeyInputDto);

      expect(apiKeyRepositoryMock.delete).toHaveBeenCalledTimes(1);
      expect(apiKeyRepositoryMock.delete).toHaveBeenCalledWith(apiKey1.getApiKey());
    });
  });
});
