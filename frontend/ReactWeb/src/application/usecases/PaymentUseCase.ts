import type { IPaymentService } from './interfaces/IPaymentService';
import type { IPaymentUseCase } from './interfaces/IPaymentUseCase';
import type { 
  SubscriptionProduct, 
  PaymentMethod, 
  Coupon, 
  PaymentRequest, 
  PaymentResponse,
  PaymentValidationError,
  CardDetails 
} from '../../domain/types/payment';

// Payment UseCase 구현체 - Service를 사용하여 애플리케이션 로직 조율
export class PaymentUseCase implements IPaymentUseCase {
  constructor(private paymentService: IPaymentService) {}

  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    return await this.paymentService.getSubscriptionProducts();
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await this.paymentService.getPaymentMethods();
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    return await this.paymentService.validateCoupon(code);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return await this.paymentService.processPayment(request);
  }

  async getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
    return await this.paymentService.getPaymentHistory(userId);
  }

  async refundPayment(paymentId: string, amount: number): Promise<PaymentResponse> {
    return await this.paymentService.refundPayment(paymentId, amount);
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    return await this.paymentService.getPaymentStatus(paymentId);
  }

  async savePaymentMethod(userId: string, paymentMethod: PaymentMethod): Promise<void> {
    return await this.paymentService.savePaymentMethod(userId, paymentMethod);
  }

  async getSavedPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    return await this.paymentService.getSavedPaymentMethods(userId);
  }

  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[] {
    return this.paymentService.validateCardDetails(cardDetails);
  }

  calculateDiscountedPrice(product: SubscriptionProduct, coupon?: Coupon): number {
    return this.paymentService.calculateDiscountedPrice(product, coupon);
  }

  calculatePaymentFee(amount: number, paymentMethod: string): number {
    return this.paymentService.calculatePaymentFee(amount, paymentMethod);
  }

  validatePaymentRequest(request: PaymentRequest): PaymentValidationError[] {
    return this.paymentService.validatePaymentRequest(request);
  }

  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentResponse> {
    return await this.paymentService.processRefund(paymentId, amount, reason);
  }
} 