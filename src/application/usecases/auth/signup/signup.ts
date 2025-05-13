import { hash } from 'bcryptjs';
import { SignupInputDto, SignupOutputDto } from './signup.dto';
import { Account } from 'src/application/domain/entities/account.entity';
import { AccountRepository } from 'src/application/repositories/account.repository';

export class SignupUsecase {
  constructor(private readonly accountRepository: AccountRepository) { }

  public async execute(signupInputDto: SignupInputDto): Promise<SignupOutputDto> {
    const existingAccount = await this.accountRepository.findByEmail(signupInputDto.email);

    if (existingAccount) {
      throw new Error('user already exists');
    }

    const hashedPassword = await hash(signupInputDto.password, 10);

    const account = Account.create({
      name: signupInputDto.name,
      email: signupInputDto.email,
      password: hashedPassword,
    });

    await this.accountRepository.create(account);
  }
}
