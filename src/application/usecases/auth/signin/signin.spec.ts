import { config } from 'dotenv';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { SigninUsecase } from './signin';
import { SigninInputDto } from './signin.dto';
import { Account } from 'src/application/domain/entities/account.entity';
import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';

config();

describe('signin', () => {
  let signinUsecase: SigninUsecase;
  let signinInputDto: SigninInputDto;

  let accountRepositoryMock: AccountRepository;
  let apiKeyRepositoryMock: ApiKeyRepository;

  beforeEach(() => {
    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
    };

    apiKeyRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
      findByApiKey: jest.fn().mockResolvedValueOnce(null),
      listByAccountId: jest.fn().mockResolvedValueOnce(null),
      delete: jest.fn().mockResolvedValueOnce(null),
    };

    signinUsecase = new SigninUsecase(accountRepositoryMock, apiKeyRepositoryMock);

    signinInputDto = {
      email: 'john@doe.com',
      password: '12345678',
      apiKey: '123456789'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(signinUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should sign in with an API key', async () => {
      apiKeyRepositoryMock.findByApiKey = jest.fn().mockResolvedValueOnce({
        getAccountId: jest.fn().mockReturnValue('12345678'),
      });

      await signinUsecase.execute(signinInputDto);

      expect(apiKeyRepositoryMock.findByApiKey).toHaveBeenCalledTimes(1);
      expect(apiKeyRepositoryMock.findByApiKey).toHaveBeenCalledWith(signinInputDto.apiKey);
    });

    it('should throw an error if the API key is invalid', async () => {
      apiKeyRepositoryMock.findByApiKey = jest.fn().mockResolvedValueOnce(null);

      await expect(signinUsecase.execute(signinInputDto)).rejects.toThrow(
        'invalid api key',
      );

      expect(apiKeyRepositoryMock.findByApiKey).toHaveBeenCalledTimes(1);
    });

    it('should sign in an existing account', async () => {
      signinInputDto.apiKey = undefined;

      const account = Account.with({
        id: '12345678',
        name: 'John Doe',
        email: signinInputDto.email,
        password: '$2b$10$yLOcgQ5kbJonWGxgc5DxYOxrFSK2RTNaUZMkh.Ztc4kM16p51GiOq',
        notificationQuantity: 0,
      });
      accountRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(account);

      await signinUsecase.execute(signinInputDto);

      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledWith(signinInputDto.email);
    });

    it('should throw an error if the account does not exist', async () => {
      signinInputDto.apiKey = undefined;

      accountRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(null);

      await expect(signinUsecase.execute(signinInputDto)).rejects.toThrow(
        'account not found',
      );

      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the password is invalid', async () => {
      signinInputDto.apiKey = undefined;

      const account = Account.with({
        id: '12345678',
        name: 'John Doe',
        email: signinInputDto.email,
        password: '12345678',
        notificationQuantity: 0,
      });
      accountRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce(account);

      await expect(signinUsecase.execute(signinInputDto)).rejects.toThrow(
        'invalid credentials',
      );

      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
    });
  });
});
