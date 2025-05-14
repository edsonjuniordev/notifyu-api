import { Account } from '../domain/entities/account.entity';

export interface AccountRepository {
  create(account: Account): Promise<void>;
  findByEmail(email: string): Promise<Account | null>;
  findByIdAndLock(id: string): Promise<Account | null>;
  update(account: Account): Promise<void>
  unlock(account: Account): Promise<void>
}
