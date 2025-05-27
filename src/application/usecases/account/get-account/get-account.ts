import { AccountRepository } from 'src/application/repositories/account.repository';
import { GetAccountInputDto, GetAccountOutputDto } from './get-account.dto';

export class GetAccountUsecase {
  constructor(private readonly accountRepository: AccountRepository) { }

  public async execute(input: GetAccountInputDto): Promise<GetAccountOutputDto> {
    const account = await this.accountRepository.findById(input.accountId);

    if (!account) {
      throw new Error('account not found');
    }

    return {
      id: account.getId(),
      name: account.getName(),
      email: account.getEmail(),
      document: account.getDocument(),
      httpNotificationQuantity: account.getHttpNotificationQuantity(),
      createdAt: account.getCreatedAt(),
    };
  }
}
