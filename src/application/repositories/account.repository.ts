import { Account } from '../domain/entities/account.entity';

export interface AccountRepository {
  create(account: Account): Promise<void>;
  findByEmail(email: string): Promise<Account | null>;
  findById(id: string): Promise<Account | null>;
  findByIdAndLock(id: string, lockOwner: string): Promise<Account | null>;
  update(account: Account, lockOwner: string): Promise<void>
  unlock(account: Account, lockOwner: string): Promise<void>
}
