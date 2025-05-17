import { hash } from 'bcryptjs';
import { SignupInputDto, SignupOutputDto } from './signup.dto';
import { Account } from 'src/application/domain/entities/account.entity';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { PaymentService } from 'src/application/services/payment-service';

export class SignupUsecase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly paymentService: PaymentService
  ) { }

  public async execute(signupInputDto: SignupInputDto): Promise<SignupOutputDto> {
    const existingAccount = await this.accountRepository.findByEmail(signupInputDto.email);

    if (existingAccount) {
      throw new Error('user already exists');
    }

    const hashedPassword = await hash(signupInputDto.password, 10);

    const account = Account.create({
      name: signupInputDto.name,
      email: signupInputDto.email,
      document: signupInputDto.document,
      password: hashedPassword,
    });

    const externalReference = await this.paymentService.createAccount(account);

    account.attachExternalReference(externalReference);

    await this.accountRepository.create(account);
  }
}
