import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ListApiKeysUsecase } from 'src/application/usecases/api-key/list-api-keys/list-api-keys';
import { dynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const listApiKeysUsecase = new ListApiKeysUsecase(dynamoApiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const response = await listApiKeysUsecase.execute({ accountId });

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
