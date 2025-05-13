import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Account } from 'src/application/domain/entities/account.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class AccountEntityToModelMapper {
  public static map(account: Account): PutCommand {
    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ACCOUNT#${account.getEmail()}`,
        SK: `ACCOUNT#${account.getEmail()}`,
        type: 'ACCOUNT',
        id: account.getId(),
        name: account.getName(),
        email: account.getEmail(),
        password: account.getPassword(),
        notificationQuantity: account.getNotificationQuantity(),
      },
    });
  }
}
