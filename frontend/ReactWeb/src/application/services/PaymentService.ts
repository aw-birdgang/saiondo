import type { IPaymentService } from '../usecases/interfaces/IPaymentService';
import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
  PaymentRequest,
  PaymentResponse,
  PaymentValidationError,
  CardDetails,
} from '../../domain/types/payment';
import { PaymentRepository } from '../../infrastructure/repositories/PaymentRepository';

export class PaymentService implements IPaymentService {
  constructor(private readonly paymentRepository: PaymentRepository) {}

  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    return await this.paymentRepository.getSubscriptionProducts();
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return await this.paymentRepository.getPaymentMethods();
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    return await this.paymentRepository.validateCoupon(code);
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    return await this.paymentRepository.processPayment(request);
  }

  async getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
    // 실제 구현에서는 결제 히스토리를 반환
    return [];
  }

  async refundPayment(paymentId: string, amount: number): Promise<PaymentResponse> {
    // 실제 구현에서는 환불을 처리
    return {
      success: true,
      transactionId: `REFUND_${Date.now()}`,
      message: 'Refund processed successfully'
    };
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    // 실제 구현에서는 결제 상태를 반환
    return 'completed';
  }

  async savePaymentMethod(userId: string, paymentMethod: PaymentMethod): Promise<void> {
    // 실제 구현에서는 결제 방법을 저장
    console.log('Payment method saved');
  }

  async getSavedPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    // 실제 구현에서는 저장된 결제 방법을 반환
    return [];
  }

  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];
    
    if (!cardDetails.number || cardDetails.number.length < 13) {
      errors.push({ field: 'number', message: 'Invalid card number' });
    }
    
    if (!cardDetails.expiry) {
      errors.push({ field: 'expiry', message: 'Expiry date is required' });
    }
    
    return errors;
  }

  calculateDiscountedPrice(product: SubscriptionProduct, coupon?: Coupon): number {
    let price = parseFloat(product.price.replace(/[^\d.]/g, ''));
    
    if (coupon && coupon.isValid) {
      price = price * (1 - coupon.discountPercent / 100);
    }
    
    return price;
  }

  calculatePaymentFee(amount: number, paymentMethod: string): number {
    // 간단한 수수료 계산 로직
    const baseFee = 0.029; // 2.9%
    const fixedFee = 0.30; // $0.30
    
    return amount * baseFee + fixedFee;
  }

  validatePaymentRequest(request: PaymentRequest): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];
    
    if (!request.productId) {
      errors.push({ field: 'productId', message: 'Product ID is required' });
    }
    
    if (!request.paymentMethod) {
      errors.push({ field: 'paymentMethod', message: 'Payment method is required' });
    }
    
    return errors;
  }

  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentResponse> {
    // 실제 구현에서는 환불을 처리
    return {
      success: true,
      transactionId: `REFUND_${Date.now()}`,
      message: 'Refund processed successfully'
    };
  }
} 