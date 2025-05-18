import { Order } from '../domain/entities/order.entity';

export interface OrderRepository {
  create(order: Order): Promise<void>;
}
