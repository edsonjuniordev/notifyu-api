import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';
import { DynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DeleteApiKeyUsecase } from 'src/application/usecases/api-key/delete-api-key/delete-api-key';

const apiKeyRepository = new DynamoApiKeyRepository(dynamoClient);

const deleteApiKeyUsecase = new DeleteApiKeyUsecase(apiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const id = event.pathParameters['id'];

    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    await deleteApiKeyUsecase.execute({ id, accountId });
    return ResponseParser.parse(204);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
