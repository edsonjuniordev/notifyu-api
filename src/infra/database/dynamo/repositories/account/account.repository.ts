import { DynamoDBDocumentClient, PutCommand, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { Account } from 'src/application/domain/entities/account.entity';
import { AccountEntityToModelMapper } from './mappers/account-entity-to-model';
import { AccountModelToEntityMapper } from './mappers/account-model-to-entity';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { dynamoClient, GSI1_INDEX_NAME, TABLE_NAME } from '../../dynamo-client';
import { Wait } from 'src/application/utils/wait';

const MAX_RETRIES = 3;
const RETRY_TIME = 100; //ms

export class DynamoAccountRepository implements AccountRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(account: Account): Promise<void> {
    const command = AccountEntityToModelMapper.map(account);

    await this.dynamoClient.send(command);
  }

  public async findById(id: string): Promise<Account | null> {
    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_INDEX_NAME,
      KeyConditionExpression: 'GSI1PK = :pk and GSI1SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `ACCOUNT#${id}`,
        ':sk': `ACCOUNT#${id}`,
      }
    });

    const result = await this.dynamoClient.send(queryCommand);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const account = AccountModelToEntityMapper.map(items[0]);

    return account;
  }

  public async findByIdAndLock(id: string, retries: number = 1): Promise<Account | null> {
    if (retries > MAX_RETRIES) {
      throw new Error('could not lock the record');
    }

    const queryCommand = new QueryCommand({
      TableName: TABLE_NAME,
      IndexName: GSI1_INDEX_NAME,
      KeyConditionExpression: 'GSI1PK = :pk and GSI1SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `ACCOUNT#${id}`,
        ':sk': `ACCOUNT#${id}`,
      }
    });

    const result = await this.dynamoClient.send(queryCommand);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const accountModel = items[0];

    if (accountModel.locked) {
      await Wait.wait(RETRY_TIME);
      return this.findByIdAndLock(id, retries++);
    }

    const putCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ACCOUNT#${accountModel.email}`,
        SK: `ACCOUNT#${accountModel.email}`,
        GSI1PK: `ACCOUNT#${accountModel.id}`,
        GSI1SK: `ACCOUNT#${accountModel.id}`,
        type: 'ACCOUNT',
        id: accountModel.id,
        name: accountModel.name,
        email: accountModel.email,
        password: accountModel.password,
        notificationQuantity: accountModel.notificationQuantity,
        locked: true
      },
    });

    await this.dynamoClient.send(putCommand);

    const account = AccountModelToEntityMapper.map(accountModel);

    return account;
  }

  public async findByEmail(email: string): Promise<Account | null> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
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

  public async update(account: Account): Promise<void> {
    const command = AccountEntityToModelMapper.map(account);

    await this.dynamoClient.send(command);
  }

  public async unlock(account: Account): Promise<void> {
    const command = AccountEntityToModelMapper.map(account);

    await this.dynamoClient.send(command);
  }
}

export const dynamoAccountRepository = new DynamoAccountRepository(dynamoClient);
