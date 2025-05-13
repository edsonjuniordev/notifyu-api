import { ApiKey } from 'src/application/domain/entities/api-key.entity';
import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { ListApiKeysUsecase } from './list-api-keys';
import { ListApiKeysInputDto } from './list-api-keys.dto';

describe('list-api-keys', () => {
  let listApiKeysUsecase: ListApiKeysUsecase;
  let listApiKeysInputDto: ListApiKeysInputDto;

  let apiKeyRepositoryMock: ApiKeyRepository;

  beforeEach(() => {
    apiKeyRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      findByApiKey: jest.fn().mockResolvedValueOnce(null),
      listByAccountId: jest.fn().mockResolvedValueOnce(null),
      delete: jest.fn().mockResolvedValueOnce(null),
    };

    listApiKeysUsecase = new ListApiKeysUsecase(apiKeyRepositoryMock);
    listApiKeysInputDto = {
      accountId: 'account-id',
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(listApiKeysUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should list api keys from an account', async () => {
      const apiKey1 = ApiKey.create({
        accountId: 'account-id',
      });
      const apiKey2 = ApiKey.create({
        accountId: 'account-id',
      });
      apiKeyRepositoryMock.listByAccountId = jest.fn().mockResolvedValueOnce([apiKey1, apiKey2]);

      await listApiKeysUsecase.execute(listApiKeysInputDto);

      expect(apiKeyRepositoryMock.listByAccountId).toHaveBeenCalledTimes(1);
      expect(apiKeyRepositoryMock.listByAccountId).toHaveBeenCalledWith(listApiKeysInputDto.accountId);
    });
  });
});
