import type { 
  SubscriptionProduct, 
  PaymentMethod, 
  Coupon, 
  PaymentRequest, 
  PaymentResponse,
  PaymentValidationError,
  CardDetails 
} from '../../domain/types/payment';

export interface IPaymentRepository {
  getSubscriptionProducts(): Promise<SubscriptionProduct[]>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  validateCoupon(code: string): Promise<Coupon | null>;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
}

export interface IPaymentUseCase {
  getSubscriptionProducts(): Promise<SubscriptionProduct[]>;
  getPaymentMethods(): Promise<PaymentMethod[]>;
  validateCoupon(code: string): Promise<Coupon | null>;
  processPayment(request: PaymentRequest): Promise<PaymentResponse>;
  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[];
  calculateDiscountedPrice(product: SubscriptionProduct, coupon?: Coupon): number;
}

export class PaymentUseCase implements IPaymentUseCase {
  constructor(private paymentRepository: IPaymentRepository) {}

  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    try {
      return await this.paymentRepository.getSubscriptionProducts();
    } catch (error) {
      console.error('Failed to fetch subscription products:', error);
      throw new Error('구독 상품을 불러오는데 실패했습니다.');
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      return await this.paymentRepository.getPaymentMethods();
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw new Error('결제 방법을 불러오는데 실패했습니다.');
    }
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    if (!code.trim()) {
      throw new Error('쿠폰 코드를 입력해주세요.');
    }

    try {
      return await this.paymentRepository.validateCoupon(code);
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      throw new Error('쿠폰 검증에 실패했습니다.');
    }
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // 결제 요청 유효성 검사
    if (!request.productId) {
      throw new Error('상품을 선택해주세요.');
    }

    if (!request.paymentMethod) {
      throw new Error('결제 방법을 선택해주세요.');
    }

    // 카드 결제인 경우 카드 정보 검증
    if (request.paymentMethod === 'card' && request.cardDetails) {
      const validationErrors = this.validateCardDetails(request.cardDetails);
      if (validationErrors.length > 0) {
        throw new Error(validationErrors[0].message);
      }
    }

    try {
      return await this.paymentRepository.processPayment(request);
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error('결제 처리에 실패했습니다.');
    }
  }

  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    // 카드 번호 검증 (간단한 형식 검증)
    if (!cardDetails.number || cardDetails.number.replace(/\s/g, '').length < 13) {
      errors.push({ field: 'number', message: '유효한 카드 번호를 입력해주세요.' });
    }

    // 만료일 검증 (MM/YY 형식)
    const expiryRegex = /^(0[1-9]|1[0-2])\/([0-9]{2})$/;
    if (!expiryRegex.test(cardDetails.expiry)) {
      errors.push({ field: 'expiry', message: '올바른 만료일 형식(MM/YY)을 입력해주세요.' });
    }

    // CVV 검증
    if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
      errors.push({ field: 'cvv', message: '유효한 CVV를 입력해주세요.' });
    }

    // 카드 소유자명 검증
    if (!cardDetails.name.trim()) {
      errors.push({ field: 'name', message: '카드 소유자명을 입력해주세요.' });
    }

    return errors;
  }

  calculateDiscountedPrice(product: SubscriptionProduct, coupon?: Coupon): number {
    const price = parseInt(product.price.replace(/[^\d]/g, ''));
    const discount = coupon ? coupon.discountPercent : 0;
    return price * (1 - discount / 100);
  }
} 