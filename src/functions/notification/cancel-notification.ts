import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CancelNotificationUsecase } from 'src/application/usecases/notification/cancel-notification/cancel-notification';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { DynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const accountRepository = new DynamoAccountRepository(dynamoClient);
const notificationRepository = new DynamoNotificationRepository(dynamoClient);

const cancelNotificationUsecase = new CancelNotificationUsecase(notificationRepository, accountRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const notificationId = event.pathParameters['id'];

    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    await cancelNotificationUsecase.execute({ notificationId, accountId });

    return ResponseParser.parse(204);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
