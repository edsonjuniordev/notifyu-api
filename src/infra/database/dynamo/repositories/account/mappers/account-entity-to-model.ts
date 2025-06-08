import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Account } from 'src/application/domain/entities/account.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class AccountEntityToModelMapper {
  public static map(account: Account, lockOwner?: string): PutCommand {
    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ACCOUNT#${account.getEmail()}`,
        SK: `ACCOUNT#${account.getEmail()}`,
        GSI1PK: `ACCOUNT#${account.getId()}`,
        GSI1SK: `ACCOUNT#${account.getId()}`,
        GSI2PK: 'ACCOUNT',
        GSI2SK: `ACCOUNT#${account.getId()}`,
        type: 'ACCOUNT',
        id: account.getId(),
        name: account.getName(),
        email: account.getEmail(),
        document: account.getDocument(),
        password: account.getPassword(),
        httpNotificationQuantity: account.getHttpNotificationQuantity(),
        externalReference: account.getExternalReference(),
        createdAt: account.getCreatedAt(),
        updatedAt: account.getUpdatedAt(),
        lockOwner: false,
        locked: false
      }
    });

    if (lockOwner) {
      putCommand.input.ConditionExpression = 'lockOwner = :lockOwner';
      putCommand.input.ExpressionAttributeValues = {
        ':lockOwner': lockOwner || false
      };
    }

    return putCommand;
  }
}
