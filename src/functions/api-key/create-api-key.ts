import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreateApiKeyUsecase } from 'src/application/usecases/api-key/create-api-key/create-api-key';
import { dynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const createApiKeyUsecase = new CreateApiKeyUsecase(dynamoApiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const response = await createApiKeyUsecase.execute({ accountId });

    return ResponseParser.parse(201, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
