import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ListOrdersUsecase } from 'src/application/usecases/order/list-orders/list-orders';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoOrderRepository } from 'src/infra/database/dynamo/repositories/order/order.repository';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const orderRepository = new DynamoOrderRepository(dynamoClient);

const listOrdersUsecase = new ListOrdersUsecase(orderRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const page = event.queryStringParameters?.page;

    const status = event.queryStringParameters?.status;

    const response = await listOrdersUsecase.execute({ page, accountId, status });

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
