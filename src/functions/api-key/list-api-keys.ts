import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ListApiKeysUsecase } from 'src/application/usecases/api-key/list-api-keys/list-api-keys';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const apiKeyRepository = new DynamoApiKeyRepository(dynamoClient);

const listApiKeysUsecase = new ListApiKeysUsecase(apiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const response = await listApiKeysUsecase.execute({ accountId });

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
