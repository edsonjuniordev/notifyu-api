import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { DeleteApiKeyUsecase } from 'src/application/usecases/api-key/delete-api-key/delete-api-key';
import { dynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const deleteApiKeyUsecase = new DeleteApiKeyUsecase(dynamoApiKeyRepository);

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
