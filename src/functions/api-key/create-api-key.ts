import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { CreateApiKeyUsecase } from 'src/application/usecases/api-key/create-api-key/create-api-key';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const apiKeyRepository = new DynamoApiKeyRepository(dynamoClient);

const createApiKeyUsecase = new CreateApiKeyUsecase(apiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const response = await createApiKeyUsecase.execute({ accountId });

    return ResponseParser.parse(201, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
