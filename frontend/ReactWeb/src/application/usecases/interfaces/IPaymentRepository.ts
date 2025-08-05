import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
  PaymentRequest,
  PaymentResponse,
} from '../../../domain/types/payment';

// Payment Repository 인터페이스 - 데이터 접근만 담당
export interface IPaymentRepository {
  getSubscriptionProducts(): Promise<SubscriptionProduct[]>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  validateCoupon(code: string): Promise<Coupon | null>;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  getPaymentHistory(userId: string): Promise<PaymentResponse[]>;
  refundPayment(paymentId: string, amount: number): Promise<PaymentResponse>;
  getPaymentStatus(paymentId: string): Promise<string>;
  savePaymentMethod(
    userId: string,
    paymentMethod: PaymentMethod
  ): Promise<void>;
  getSavedPaymentMethods(userId: string): Promise<PaymentMethod[]>;
}
