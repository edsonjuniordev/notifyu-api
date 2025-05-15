import { ListPlansUsecase } from 'src/application/usecases/plan/list-plans/list-plans';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoPlanRepository } from 'src/infra/database/dynamo/repositories/plan/plan.repository';
import { ResponseParser } from '../utils/response-parser';
import { ErrorHandler } from '../utils/error-handler';

const planRepository = new DynamoPlanRepository(dynamoClient);

const listPlansUsecase = new ListPlansUsecase(planRepository);

export async function handler() {
  try {
    const response = await listPlansUsecase.execute();

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
