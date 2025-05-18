import { Account } from 'src/application/domain/entities/account.entity';
import { Order } from 'src/application/domain/entities/order.entity';
import { AccountRepository } from 'src/application/repositories/account.repository';
import { PaymentService } from 'src/application/services/payment-service';

export class AsaasPaymentService implements PaymentService {
  private ASAAS_BASE_PATH = process.env.ASAAS_BASE_PATH;
  private ASAAS_API_KEY = process.env.ASAAS_API_KEY;

  constructor(private readonly accountRepository: AccountRepository) {}

  public async createAccount(account: Account): Promise<string> {
    const payload = {
      name: account.getName(),
      email: account.getEmail(),
      cpfCnpj: account.getDocument()
    };

    const response = await fetch(`${this.ASAAS_BASE_PATH}/customers`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.ASAAS_API_KEY
      },
      body: JSON.stringify(payload || {})
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(`error create account - calling Asaas api ${JSON.stringify(body)}`);
    }

    return body['id'];
  }

  public async createOrder(order: Order): Promise<{ externalId: string; invoiceUrl: string; }> {
    const account = await this.accountRepository.findById(order.getAccountId());

    const dueDate = new Date().toISOString().split('T')[0];

    const payload = {
      customer: account.getExternalReference(),
      billingType: 'UNDEFINED',
      value: Math.ceil(order.getAmount() / 100),
      externalReference: order.getId(),
      dueDate,
    };

    const response = await fetch(`${this.ASAAS_BASE_PATH}/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'access_token': this.ASAAS_API_KEY
      },
      body: JSON.stringify(payload || {})
    });

    const body = await response.json();

    if (!response.ok) {
      throw new Error(`error create account - calling Asaas api ${JSON.stringify(body)}`);
    }

    return {
      externalId: body['id'],
      invoiceUrl: body['invoiceUrl']
    };
  }
}
