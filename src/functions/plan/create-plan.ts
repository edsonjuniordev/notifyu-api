import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreatePlanUsecase } from 'src/application/usecases/plan/create-plan/create-plan';
import { CreatePlanInputDto } from 'src/application/usecases/plan/create-plan/create-plan.dto';
import { dynamoPlanRepository } from 'src/infra/database/dynamo/repositories/plan/plan.repository';
import { BodyParser } from '../utils/body-parser';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';
import { CreatePlanValidator } from '../validators/create-plan.validator';

const createPlanUsecase = new CreatePlanUsecase(dynamoPlanRepository);

export async function handler(event: APIGatewayProxyEventV2) {
  try {
    const body = BodyParser.parse<CreatePlanInputDto>(event.body);

    const errors = CreatePlanValidator.validate(body);

    if (errors?.length > 0) {
      return ResponseParser.parse(422, errors);
    }

    const response = await createPlanUsecase.execute(body);

    return ResponseParser.parse(201, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
