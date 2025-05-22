import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ExpireOrderUsecase } from 'src/application/usecases/order/expire-order/expire-order';
import { PayOrderUsecase } from 'src/application/usecases/order/pay-order/pay-order';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { DynamoOrderRepository } from 'src/infra/database/dynamo/repositories/order/order.repository';
import { BodyParser } from '../utils/body-parser';
import { ResponseParser } from '../utils/response-parser';
import { WebhookValidator } from '../validators/webhook.validator';
import { WebhookEventType, WebhookRequest } from './webhook.dto';

const orderRepository = new DynamoOrderRepository(dynamoClient);
const accountRepository = new DynamoAccountRepository(dynamoClient);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const USECASE_MAP = new Map<string, any>();
USECASE_MAP.set(WebhookEventType.PAYMENT_CONFIRMED, new PayOrderUsecase(orderRepository, accountRepository));
USECASE_MAP.set(WebhookEventType.PAYMENT_OVERDUE, new ExpireOrderUsecase(orderRepository));
USECASE_MAP.set(WebhookEventType.PAYMENT_RECEIVED, new PayOrderUsecase(orderRepository, accountRepository));

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const apiKey = event.headers['asaas-access-token'];

    if (apiKey !== process.env.WEBHOOK_API_KEY) {
      return ResponseParser.parse(401, { message: 'Unauthorized' });
    }

    const body = BodyParser.parse<WebhookRequest>(event.body);

    const errors = WebhookValidator.validate(body);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    const useCase = USECASE_MAP.get(body.event);

    const usecaseInput = {
      orderId: body.payment.externalReference
    };

    await useCase.execute(usecaseInput);

  } catch (error) {
    console.log('🚀 ~ handler ~ error:', error);
  }

  return ResponseParser.parse(200);
}
