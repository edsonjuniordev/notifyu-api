import { DeleteCommand, DynamoDBDocumentClient, QueryCommand } from '@aws-sdk/lib-dynamodb';
import { ApiKey } from 'src/application/domain/entities/api-key.entity';
import { ApiKeyRepository } from 'src/application/repositories/api-key.repository';
import { GSI1_INDEX_NAME, TABLE_NAME } from '../../dynamo-client';
import { ApiKeyModelToEntityMapper } from './mappers/api-key-model-to-entity.mapper';
import { ApiKeyEntityToModelMapper } from './mappers/api-key-entity-to-model.mapper';

export class DynamoApiKeyRepository implements ApiKeyRepository {
  constructor(private readonly dynamoClient: DynamoDBDocumentClient) { }

  public async create(apiKey: ApiKey): Promise<void> {
    const command = ApiKeyEntityToModelMapper.map(apiKey);

    await this.dynamoClient.send(command);
  }

  public async findById(id: string, accountId: string): Promise<ApiKey | null> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'GSI1PK = :pk and GSI1SK = :sk',
      IndexName: GSI1_INDEX_NAME,
      ExpressionAttributeValues: {
        ':pk': `ACCOUNT#${accountId}`,
        ':sk': `API_KEY#${id}`,
      },
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const apiKeyEntity = ApiKeyModelToEntityMapper.map(items[0]);

    return apiKeyEntity;
  }

  public async findByApiKey(apiKey: string): Promise<ApiKey | null> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'PK = :pk and SK = :sk',
      ExpressionAttributeValues: {
        ':pk': `API_KEY#${apiKey}`,
        ':sk': `API_KEY#${apiKey}`,
      },
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return null;
    }

    const apiKeyEntity = ApiKeyModelToEntityMapper.map(items[0]);

    return apiKeyEntity;
  }

  public async listByAccountId(accountId: string): Promise<ApiKey[]> {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'GSI1PK = :pk AND begins_with(GSI1SK, :sk)',
      IndexName: GSI1_INDEX_NAME,
      ExpressionAttributeValues: {
        ':pk': `ACCOUNT#${accountId}`,
        ':sk': 'API_KEY#'
      },
    });

    const result = await this.dynamoClient.send(command);

    const items = result.Items;

    if (items.length === 0) {
      return [];
    }

    const output = items.map((item) => {
      const apiKeyEntity = ApiKeyModelToEntityMapper.map(item);

      return apiKeyEntity;
    });

    return output;
  }

  public async delete(apiKey: string): Promise<void> {
    const command = new DeleteCommand({
      TableName: TABLE_NAME,
      Key: {
        PK: `API_KEY#${apiKey}`,
        SK: `API_KEY#${apiKey}`
      }
    });

    await this.dynamoClient.send(command);
  }
}
