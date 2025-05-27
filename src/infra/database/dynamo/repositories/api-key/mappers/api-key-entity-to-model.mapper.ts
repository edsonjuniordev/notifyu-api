import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { ApiKey } from 'src/application/domain/entities/api-key.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class ApiKeyEntityToModelMapper {
  public static map(apiKey: ApiKey): PutCommand {
    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `API_KEY#${apiKey.getApiKey()}`,
        SK: `API_KEY#${apiKey.getApiKey()}`,
        GSI1PK: `ACCOUNT#${apiKey.getAccountId()}`,
        GSI1SK: `API_KEY#${apiKey.getId()}`,
        type: 'API_KEY',
        id: apiKey.getId(),
        accountId: apiKey.getAccountId(),
        apiKey: apiKey.getApiKey(),
        createdAt: apiKey.getCreatedAt(),
        updatedAt: apiKey.getUpdatedAt(),
      },
    });
  }
}
