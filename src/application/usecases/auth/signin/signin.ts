import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { SigninInputDto, SigninOutputDto } from './signin.dto';
import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';

export class SigninUsecase {
  constructor(
    private readonly accountRepository: AccountRepository,
    private readonly apiKeyRepository: ApiKeyRepository
  ) { }

  public async execute(input: SigninInputDto): Promise<SigninOutputDto> {
    const { email, password, apiKey } = input;

    if (apiKey) {
      const apiKeyEntity = await this.apiKeyRepository.findByApiKey(apiKey);

      if (!apiKeyEntity) {
        throw new Error('invalid api key');
      }

      return {
        token: this.generateToken(apiKeyEntity.getAccountId()),
      };
    }

    const account = await this.accountRepository.findByEmail(email);

    if (!account) {
      throw new Error('account not found');
    }

    const passwordValid = await compare(password, account.getPassword());

    if (!passwordValid) {
      throw new Error('invalid credentials');
    }

    return {
      token: this.generateToken(account.getId()),
    };
  }

  private generateToken(accountId: string): string {
    const payload = {
      accountId,
    };

    const token = sign(payload, process.env.JWT_SECRET, {
      expiresIn: '3h',
    });

    return token;
  }
}
