import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from 'src/application/domain/entities/order.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class OrderEntityToModelMapper {
  public static map(order: Order): PutCommand {
    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ORDER#${order.getAccountId()}`,
        SK: `ORDER#${order.getStatus()}`,
        GSI1PK: `ORDER#${order.getId()}`,
        GSI1SK: `ORDER#${order.getId()}`,
        type: 'ORDER',
        id: order.getId(),
        accountId: order.getAccountId(),
        planId: order.getPlanId(),
        amount: order.getAmount(),
        httpNotificationQuantity: order.getHttpNotificationQuantity(),
        status: order.getStatus(),
        externalId: order.getExternalId(),
        invoiceUrl: order.getInvoiceUrl()

      },
    });
  }
}
