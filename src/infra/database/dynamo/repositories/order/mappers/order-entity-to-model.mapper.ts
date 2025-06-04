import { PutCommand } from '@aws-sdk/lib-dynamodb';
import { Order } from 'src/application/domain/entities/order.entity';
import { TABLE_NAME } from '../../../dynamo-client';

export class OrderEntityToModelMapper {
  public static map(order: Order): PutCommand {
    return new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        PK: `ORDER#${order.getAccountId()}`,
        SK: `ORDER#${order.getId()}`,
        GSI1PK: `ORDER#${order.getAccountId()}`,
        GSI1SK: `ORDER#${order.getStatus()}#${order.getId()}`,
        GSI2PK: 'ORDER',
        GSI2SK: `ORDER#${order.getId()}`,
        type: 'ORDER',
        id: order.getId(),
        accountId: order.getAccountId(),
        planId: order.getPlanId(),
        amount: order.getAmount(),
        httpNotificationQuantity: order.getHttpNotificationQuantity(),
        status: order.getStatus(),
        createdAt: order.getCreatedAt(),
        updatedAt: order.getUpdatedAt(),
        externalId: order.getExternalId(),
        invoiceUrl: order.getInvoiceUrl()
      },
    });
  }
}
