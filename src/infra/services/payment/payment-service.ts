import { Account } from 'src/application/domain/entities/account.entity';
import { PaymentService } from 'src/application/services/payment-service';

export class AsaasPaymentService implements PaymentService {
  private ASAAS_BASE_PATH = process.env.ASAAS_BASE_PATH;
  private ASAAS_API_KEY = process.env.ASAAS_API_KEY;

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
      throw new Error(`error calling Asaas api ${JSON.stringify(body)}`);
    }

    return body['id'];
  }
}
