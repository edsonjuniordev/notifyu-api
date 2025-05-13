import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { CreateApiKeyUsecase } from './create-api-key';
import { CreateApiKeyInputDto } from './create-api-key.dto';

describe('create-api-key', () => {
  let createApiKeyUsecase: CreateApiKeyUsecase;
  let createApiKeyInputDto: CreateApiKeyInputDto;

  let apiKeyRepositoryMock: ApiKeyRepository;

  beforeEach(() => {
    apiKeyRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      findByApiKey: jest.fn().mockResolvedValueOnce(null),
      listByAccountId: jest.fn().mockResolvedValueOnce(null),
      delete: jest.fn().mockResolvedValueOnce(null),
    };

    createApiKeyUsecase = new CreateApiKeyUsecase(apiKeyRepositoryMock);

    createApiKeyInputDto = {
      accountId: 'account-id',
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(createApiKeyUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create an api key', async () => {
      await createApiKeyUsecase.execute(createApiKeyInputDto);

      expect(apiKeyRepositoryMock.create).toHaveBeenCalled();
    });
  });

});
