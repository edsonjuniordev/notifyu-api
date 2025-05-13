import { DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Account } from 'src/application/domain/entities/account.entity';
import { AccountEntityToModelMapper } from './mappers/account-entity-to-model';
import { AccountModelToEntityMapper } from './mappers/account-model-to-entity';
import { AccountRepository } from 'src/application/repositories/account.repository';

export class DynamoAccountRepository implements AccountRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(account: Account): Promise<void> {
    const command = AccountEntityToModelMapper.map(account);

    await this.dynamoClient.send(command);
  }

  public async findByEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: 'notifyu_table',
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `ACCOUNT#${email}`,
        ':sk': `ACCOUNT#${email}`,
      }
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const account = AccountModelToEntityMapper.map(items[0]);

    return account;
  }
}
