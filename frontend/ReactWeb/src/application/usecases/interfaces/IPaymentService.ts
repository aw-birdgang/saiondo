import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
  PaymentRequest,
  PaymentResponse,
  PaymentValidationError,
  CardDetails,
} from '@/domain/types/payment';

// Payment Service 인터페이스 - 비즈니스 로직 담당
export interface IPaymentService {
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
  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[];
  calculateDiscountedPrice(
    product: SubscriptionProduct,
    coupon?: Coupon
  ): number;
  calculatePaymentFee(amount: number, paymentMethod: string): number;
  validatePaymentRequest(request: PaymentRequest): PaymentValidationError[];
  processRefund(
    paymentId: string,
    amount: number,
    reason: string
  ): Promise<PaymentResponse>;
}
