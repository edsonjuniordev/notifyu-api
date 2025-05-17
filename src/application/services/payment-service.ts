import { Account } from '../domain/entities/account.entity';

export interface PaymentService {
  createAccount(account: Account): Promise<string>;
}
