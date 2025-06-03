import { ListPlansUsecase } from 'src/application/usecases/plan/list-plans/list-plans';
import { dynamoPlanRepository } from 'src/infra/database/dynamo/repositories/plan/plan.repository';
import { ErrorHandler } from '../utils/error-handler';
import { ResponseParser } from '../utils/response-parser';

const listPlansUsecase = new ListPlansUsecase(dynamoPlanRepository);

export async function handler() {
  try {
    const response = await listPlansUsecase.execute();

    return ResponseParser.parse(200, response);
  } catch (error) {
    return ErrorHandler.handle(error);
  }
}
