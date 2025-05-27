import { ApiKey } from 'src/application/domain/entities/api-key.entity';

export class ApiKeyModelToEntityMapper {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public static map(model: any): ApiKey {
    return ApiKey.with({
      id: model.id,
      accountId: model.accountId,
      apiKey: model.apiKey,
      createdAt: model.createdAt,
      updatedAt: model.updatedAt,
    });
  }
}
