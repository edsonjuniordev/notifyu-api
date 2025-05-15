import { APIGatewayProxyEventV2 } from 'aws-lambda';
import { CreatePlanUsecase } from 'src/application/usecases/plan/create-plan/create-plan';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoPlanRepository } from 'src/infra/database/dynamo/repositories/plan/plan.repository';
import { BodyParser } from '../utils/body-parser';
import { CreatePlanInputDto } from 'src/application/usecases/plan/create-plan/create-plan.dto';
import { CreatePlanValidator } from '../validators/create-plan.validator';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const planRepository = new DynamoPlanRepository(dynamoClient);

const createPlanUsecase = new CreatePlanUsecase(planRepository);

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
