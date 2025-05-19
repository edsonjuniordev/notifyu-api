import { Order } from '../domain/entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order>;
  update(order: Order): Promise<void>;
  list(accountId: string, page: string): Promise<{
    orders: Order[];
    nextPage: string;
  }>
  listByStatus(accountId: string, page: string, status: string): Promise<{
    orders: Order[];
    nextPage: string;
  }>
}
