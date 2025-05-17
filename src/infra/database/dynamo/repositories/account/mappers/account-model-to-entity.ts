import { Account } from 'src/application/domain/entities/account.entity';

export class AccountModelToEntityMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static map(model: any): Account {
    return Account.with({
      id: model.id,
      name: model.name,
      email: model.email,
      document: model.document,
      password: model.password,
      httpNotificationQuantity: model.httpNotificationQuantity,
      externalReference: model.externalReference
    });
  }
}
