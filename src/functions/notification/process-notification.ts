import { AttributeValue } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';
import { DynamoDBStreamEvent } from 'aws-lambda';
import { ProcessNotificationUsecase } from 'src/application/usecases/notification/process-notification/process-notification';
import { ProcessNotificationInputDto } from 'src/application/usecases/notification/process-notification/process-notification.dto';
import { dynamoClient } from 'src/infra/database/dynamo/dynamo-client';
import { DynamoNotificationRepository } from 'src/infra/database/dynamo/repositories/notification/notification.repository';

const notificationRepository = new DynamoNotificationRepository(dynamoClient);

const processNotificationUsecase = new ProcessNotificationUsecase(notificationRepository);

export async function handler(event: DynamoDBStreamEvent) {
  for (const record of event.Records) {
    if (record.eventName === 'REMOVE') {
      try {
        const oldImage = record.dynamodb.OldImage;
        const processNotificationInput = unmarshall(oldImage as Record<string, AttributeValue>) as ProcessNotificationInputDto;
        await processNotificationUsecase.execute(processNotificationInput);
      } catch (error) {
        console.log('🚀 ~ handler ~ error:', error);
      }
    }
  }
}
