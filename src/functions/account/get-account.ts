import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { GetAccountUsecase } from 'src/application/usecases/account/get-account/get-account';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const accountRepository = new DynamoAccountRepository(dynamoClient);

const getAccountUsecase = new GetAccountUsecase(accountRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const response = await getAccountUsecase.execute({ accountId });

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
