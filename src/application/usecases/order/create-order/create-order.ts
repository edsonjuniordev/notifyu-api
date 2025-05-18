import { OrderRepository } from 'src/application/repositories/order.repository';
import { PaymentService } from 'src/application/services/payment-service';
import { CreateOrderInputDto, CreateOrderOutputDto } from './create-order.dto';
import { Order } from 'src/application/domain/entities/order.entity';
import { PlanRepository } from 'src/application/repositories/plan.repository';

export class CreateOrderUsecase {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly planRepository: PlanRepository,
    private readonly paymnetService: PaymentService
  ) { }

  public async execute(input: CreateOrderInputDto): Promise<CreateOrderOutputDto> {
    const plan = await this.planRepository.findById(input.planId);

    if (!plan) {
      throw new Error('plan not found');
    }

    const order = Order.create({
      accountId: input.accountId,
      planId: input.planId,
      amount: plan.getAmount(),
      httpNotificationQuantity: plan.getHttpNotificationQuantity(),
    });

    const { externalId, invoiceUrl } = await this.paymnetService.createOrder(order);

    order.addExternalId(externalId);
    order.addInvoiceUrl(invoiceUrl);

    await this.orderRepository.create(order);

    return {
      id: order.getId(),
      accountId: order.getAccountId(),
      planId: order.getPlanId(),
      amount: order.getAmount(),
      httpNotificationQuantity: order.getHttpNotificationQuantity(),
      status: order.getStatus(),
      invoiceUrl: order.getInvoiceUrl(),
    };
  }
}
