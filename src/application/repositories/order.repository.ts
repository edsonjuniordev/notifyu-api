import { Order } from '../domain/entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<void>;
  findById(orderId: string): Promise<Order>;
  update(order: Order): Promise<void>;
}
