import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { SigninUsecase } from 'src/application/usecases/auth/signin/signin';
import { SigninInputDto } from 'src/application/usecases/auth/signin/signin.dto';
import { SigninValidator } from '../validators/signin.validator';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoApiKeyRepository } from 'src/infra/database/dynamo/repositories/api-key/api-key.repository';
import { BodyParser } from '../utils/body-parser';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const accountRepository = new DynamoAccountRepository(dynamoClient);
const apiKeyRepository = new DynamoApiKeyRepository(dynamoClient);

const signinUsecase = new SigninUsecase(accountRepository, apiKeyRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = BodyParser.parse<SigninInputDto>(event.body);

    const headers = event.headers;

    const apiKey = headers['api-key'];

    const bodyFormated = {
      ...body,
      apiKey,
    };

    const errors = SigninValidator.validate(bodyFormated);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    const output = await signinUsecase.execute(bodyFormated);

    return ResponseParser.parse(200, output);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
