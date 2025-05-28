import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { SignupUsecase } from 'src/application/usecases/auth/signup/signup';
import { SignupInputDto } from 'src/application/usecases/auth/signup/signup.dto';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { SignupValidator } from '../validators/signup.validator';
import { BodyParser } from '../utils/body-parser';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';
import { AsaasPaymentService } from 'src/infra/services/payment/payment-service';

const accountRepository = new DynamoAccountRepository(dynamoClient);

const paymentService = new AsaasPaymentService(accountRepository);

const signupUsecase = new SignupUsecase(accountRepository, paymentService);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = BodyParser.parse<SignupInputDto>(event.body);

    const errors = SignupValidator.validate(body);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    await signupUsecase.execute(body);

    return ResponseParser.parse(201);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
