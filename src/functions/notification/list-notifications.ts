import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { ListNotificationsUsecase } from 'src/application/usecases/notification/list-notifications/list-notifications';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const notificationRepository = new DynamoNotificationRepository(dynamoClient);

const listNotificationsUsecase = new ListNotificationsUsecase(notificationRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const page = event.queryStringParameters?.page;

    const response = await listNotificationsUsecase.execute({ page, accountId });

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
