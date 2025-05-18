import { Account } from '../domain/entities/account.entity';
import { Order } from '../domain/entities/order.entity';

export interface PaymentService {
  createAccount(account: Account): Promise<string>;
  createOrder(order: Order): Promise<{
    externalId: string;
    invoiceUrl: string;
  }>
}
