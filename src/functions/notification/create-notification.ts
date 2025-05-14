import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreateNotificationUsecase } from 'src/application/usecases/notifications/create-notification';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { DynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';
import { BodyParser } from '../utils/body-parser';
import { CreateNotificationInputDto } from 'src/application/usecases/notifications/create-notification.dto';
import { CreateNotificationValidator } from '../validators/create-notification.validator';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const accountRepository = new DynamoAccountRepository(dynamoClient);
const notificationRepository = new DynamoNotificationRepository(dynamoClient);

const createNotificationUsecase = new CreateNotificationUsecase(accountRepository, notificationRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const accountId = event.requestContext['authorizer']['lambda']['accountId'];

    const body = BodyParser.parse<CreateNotificationInputDto>(event.body);

    const errors = CreateNotificationValidator.validate(body);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    const response = await createNotificationUsecase.execute({ ...body, accountId });

    return ResponseParser.parse(201, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
