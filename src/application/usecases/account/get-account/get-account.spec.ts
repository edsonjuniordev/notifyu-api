import { AccountRepository } from 'src/application/repositories/account.repository';
import { GetAccountUsecase } from './get-account';
import { GetAccountInputDto } from './get-account.dto';
import { Account } from 'src/application/domain/entities/account.entity';

describe('get-account', () => {
  let getAccountUsecase: GetAccountUsecase;
  let getAccountInputDto: GetAccountInputDto;

  let accountRepositoryMock: AccountRepository;

  beforeEach(() => {
    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
      findById: jest.fn().mockResolvedValueOnce(null),
    };

    getAccountUsecase = new GetAccountUsecase(accountRepositoryMock);

    getAccountInputDto = {
      accountId: 'accountId'
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(getAccountUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should get an account', async () => {
      const account = Account.create({
        name: 'name',
        email: 'email',
        document: 'document',
        password: 'password',
      });

      accountRepositoryMock.findById = jest.fn().mockResolvedValueOnce(account);

      await getAccountUsecase.execute(getAccountInputDto);

      expect(accountRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findById).toHaveBeenCalledWith(getAccountInputDto.accountId);
    });

    it('should throw an error if the account does not exist', async () => {
      await expect(getAccountUsecase.execute(getAccountInputDto)).rejects.toThrow(
        'account not found',
      );

      expect(accountRepositoryMock.findById).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findById).toHaveBeenCalledWith(getAccountInputDto.accountId);
    });
  });
});
