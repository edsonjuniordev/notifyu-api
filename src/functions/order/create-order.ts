import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreateOrderUsecase } from 'src/application/usecases/order/create-order/create-order';
import { CreateOrderInputDto } from 'src/application/usecases/order/create-order/create-order.dto';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { DynamoOrderRepository } from 'src/infra/database/dynamo/repositories/order/order.repository';
import { DynamoPlanRepository } from 'src/infra/database/dynamo/repositories/plan/plan.repository';
import { AsaasPaymentService } from 'src/infra/services/payment/payment-service';
import { BodyParser } from '../utils/body-parser';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';
import { CreateOrderValidator } from '../validators/create-order.validator';

const orderRepository = new DynamoOrderRepository(dynamoClient);
const planRepository = new DynamoPlanRepository(dynamoClient);
const accountRepository = new DynamoAccountRepository(dynamoClient);
const paymentService = new AsaasPaymentService(accountRepository);

const createOrderUsecase = new CreateOrderUsecase(orderRepository, planRepository, paymentService, accountRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const body = BodyParser.parse<CreateOrderInputDto>(event.body);

    const errors = CreateOrderValidator.validate(body);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    const response = await createOrderUsecase.execute({ ...body, accountId });

    return ResponseParser.parse(201, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
