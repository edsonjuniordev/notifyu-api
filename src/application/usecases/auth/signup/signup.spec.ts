import { AccountRepository } from 'src/application/repositories/account.repository';
import { SignupUsecase } from './signup';
import { SignupInputDto } from './signup.dto';
import { PaymentService } from 'src/application/services/payment-service';

describe('signup', () => {
  let signupUsecase: SignupUsecase;
  let signupInputDto: SignupInputDto;

  let accountRepositoryMock: AccountRepository;
  let paymnetServiceMock: PaymentService;

  beforeEach(() => {
    accountRepositoryMock = {
      create: jest.fn().mockResolvedValueOnce(null),
      findByEmail: jest.fn().mockResolvedValueOnce(null),
      findByIdAndLock: jest.fn().mockResolvedValueOnce(null),
      update: jest.fn().mockResolvedValueOnce(null),
      unlock: jest.fn().mockResolvedValueOnce(null),
    };
    paymnetServiceMock = {
      createAccount: jest.fn().mockResolvedValueOnce(null)
    };
    signupUsecase = new SignupUsecase(accountRepositoryMock, paymnetServiceMock);
    signupInputDto = {
      name: 'John Doe',
      email: 'john@doe.com',
      document: '123456788910',
      password: 'password123',
    };
  });

  describe('build', () => {
    it('should be defined', () => {
      expect(signupUsecase).toBeDefined();
    });
  });

  describe('execute', () => {
    it('should create a new account', async () => {
      await signupUsecase.execute(signupInputDto);

      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.findByEmail).toHaveBeenCalledWith(signupInputDto.email);
      expect(paymnetServiceMock.createAccount).toHaveBeenCalledTimes(1);
      expect(accountRepositoryMock.create).toHaveBeenCalledTimes(1);
    });

    it('should throw an error if the account already exists', async () => {
      accountRepositoryMock.findByEmail = jest.fn().mockResolvedValueOnce({});

      await expect(signupUsecase.execute(signupInputDto)).rejects.toThrow(
        'user already exists',
      );

      expect(accountRepositoryMock.create).not.toHaveBeenCalled();
    });
  });
});
