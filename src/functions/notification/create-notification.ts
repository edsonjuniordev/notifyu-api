import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreateNotificationUsecase } from 'src/application/usecases/notification/create-notification/create-notification';
import { CreateNotificationInputDto } from 'src/application/usecases/notification/create-notification/create-notification.dto';
import { dynamoAccountRepository } from 'src/infra/database/dynamo/repositories/account/account.repository';
import { dynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';
import { BodyParser } from '../utils/body-parser';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';
import { CreateNotificationValidator } from '../validators/create-notification.validator';

const createNotificationUsecase = new CreateNotificationUsecase(dynamoAccountRepository, dynamoNotificationRepository);

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
