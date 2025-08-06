import type { IPaymentUseCase } from './interfaces/IPaymentUseCase';
import type { PaymentMethod, SubscriptionProduct } from '@/domain/types/payment';

export class PaymentUseCase implements IPaymentUseCase {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async getProducts(): Promise<SubscriptionProduct[]> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async processPayment(paymentData: any): Promise<any> {
    // 구현 예정
    throw new Error('Method not implemented.');
  }

  async validatePaymentMethod(method: PaymentMethod): Promise<boolean> {
    // 구현 예정
    return method.id ? true : false;
  }
} 