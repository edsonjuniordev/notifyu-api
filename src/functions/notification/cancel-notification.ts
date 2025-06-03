import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CancelNotificationUsecase } from 'src/application/usecases/notification/cancel-notification/cancel-notification';
import { dynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { dynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const cancelNotificationUsecase = new CancelNotificationUsecase(dynamoNotificationRepository, dynamoAccountRepository);

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
