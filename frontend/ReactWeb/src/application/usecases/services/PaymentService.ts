import type { 
  SubscriptionProduct, 
  PaymentMethod, 
  Coupon, 
  PaymentRequest, 
  PaymentResponse,
  PaymentValidationError,
  CardDetails 
} from '../../../domain/types/payment';
import type { IPaymentRepository } from '../interfaces/IPaymentRepository';
import type { IPaymentService } from '../interfaces/IPaymentService';
import type { ICache } from '../interfaces/ICache';
import { PAYMENT_ERROR_MESSAGES, PAYMENT_CACHE_TTL, CARD_VALIDATION, PAYMENT_LIMITS, PAYMENT_FEES } from '../constants/PaymentConstants';
import { MemoryCache } from '../cache/MemoryCache';

// Payment Service 구현체
export class PaymentService implements IPaymentService {
  private cache: ICache;

  constructor(
    private paymentRepository: IPaymentRepository,
    cache?: ICache
  ) {
    this.cache = cache || new MemoryCache();
  }

  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    try {
      // 캐시 확인
      const cacheKey = 'subscription_products';
      const cached = this.cache.get<SubscriptionProduct[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const products = await this.paymentRepository.getSubscriptionProducts();
      
      // 캐시 저장
      this.cache.set(cacheKey, products, PAYMENT_CACHE_TTL.PRODUCTS);
      
      return products;
    } catch (error) {
      console.error('Failed to fetch subscription products:', error);
      throw new Error(PAYMENT_ERROR_MESSAGES.OPERATION.PRODUCTS_FETCH_FAILED);
    }
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      // 캐시 확인
      const cacheKey = 'payment_methods';
      const cached = this.cache.get<PaymentMethod[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const methods = await this.paymentRepository.getPaymentMethods();
      
      // 캐시 저장
      this.cache.set(cacheKey, methods, PAYMENT_CACHE_TTL.PAYMENT_METHODS);
      
      return methods;
    } catch (error) {
      console.error('Failed to fetch payment methods:', error);
      throw new Error(PAYMENT_ERROR_MESSAGES.OPERATION.PAYMENT_METHODS_FETCH_FAILED);
    }
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    if (!code.trim()) {
      throw new Error(PAYMENT_ERROR_MESSAGES.VALIDATION.COUPON_CODE_REQUIRED);
    }

    try {
      // 캐시 확인
      const cacheKey = `coupon:${code}`;
      const cached = this.cache.get<Coupon>(cacheKey);
      if (cached) {
        return cached;
      }

      const coupon = await this.paymentRepository.validateCoupon(code);
      
      if (coupon) {
        // 캐시 저장
        this.cache.set(cacheKey, coupon, PAYMENT_CACHE_TTL.COUPON_VALIDATION);
      }
      
      return coupon;
    } catch (error) {
      console.error('Failed to validate coupon:', error);
      throw new Error(PAYMENT_ERROR_MESSAGES.OPERATION.COUPON_VALIDATION_FAILED);
    }
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // 결제 요청 유효성 검사
    const validationErrors = this.validatePaymentRequest(request);
    if (validationErrors.length > 0) {
      throw new Error(validationErrors[0].message);
    }

    try {
      const response = await this.paymentRepository.processPayment(request);
      
      // 결제 성공 시 관련 캐시 무효화
      this.invalidatePaymentCache();
      
      return response;
    } catch (error) {
      console.error('Payment processing failed:', error);
      throw new Error(PAYMENT_ERROR_MESSAGES.OPERATION.PAYMENT_PROCESSING_FAILED);
    }
  }

  async getPaymentHistory(userId: string): Promise<PaymentResponse[]> {
    try {
      return await this.paymentRepository.getPaymentHistory(userId);
    } catch (error) {
      console.error('Failed to get payment history:', error);
      return [];
    }
  }

  async refundPayment(paymentId: string, amount: number): Promise<PaymentResponse> {
    try {
      return await this.paymentRepository.refundPayment(paymentId, amount);
    } catch (error) {
      console.error('Failed to refund payment:', error);
      throw new Error('환불 처리에 실패했습니다.');
    }
  }

  async getPaymentStatus(paymentId: string): Promise<string> {
    try {
      return await this.paymentRepository.getPaymentStatus(paymentId);
    } catch (error) {
      console.error('Failed to get payment status:', error);
      throw new Error('결제 상태 조회에 실패했습니다.');
    }
  }

  async savePaymentMethod(userId: string, paymentMethod: PaymentMethod): Promise<void> {
    try {
      await this.paymentRepository.savePaymentMethod(userId, paymentMethod);
      
      // 저장된 결제 방법 캐시 무효화
      this.cache.delete(`saved_methods:${userId}`);
    } catch (error) {
      console.error('Failed to save payment method:', error);
      throw new Error('결제 방법 저장에 실패했습니다.');
    }
  }

  async getSavedPaymentMethods(userId: string): Promise<PaymentMethod[]> {
    try {
      // 캐시 확인
      const cacheKey = `saved_methods:${userId}`;
      const cached = this.cache.get<PaymentMethod[]>(cacheKey);
      if (cached) {
        return cached;
      }

      const methods = await this.paymentRepository.getSavedPaymentMethods(userId);
      
      // 캐시 저장
      this.cache.set(cacheKey, methods, PAYMENT_CACHE_TTL.PAYMENT_METHODS);
      
      return methods;
    } catch (error) {
      console.error('Failed to get saved payment methods:', error);
      return [];
    }
  }

  validateCardDetails(cardDetails: CardDetails): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    // 카드 번호 검증
    if (!cardDetails.number || !CARD_VALIDATION.CARD_NUMBER_REGEX.test(cardDetails.number)) {
      errors.push({ field: 'number', message: PAYMENT_ERROR_MESSAGES.VALIDATION.CARD_NUMBER_INVALID });
    } else {
      const cleanNumber = cardDetails.number.replace(/\s/g, '');
      if (cleanNumber.length < CARD_VALIDATION.MIN_CARD_LENGTH || cleanNumber.length > CARD_VALIDATION.MAX_CARD_LENGTH) {
        errors.push({ field: 'number', message: PAYMENT_ERROR_MESSAGES.VALIDATION.CARD_NUMBER_INVALID });
      }
    }

    // 만료일 검증
    if (!CARD_VALIDATION.EXPIRY_REGEX.test(cardDetails.expiry)) {
      errors.push({ field: 'expiry', message: PAYMENT_ERROR_MESSAGES.VALIDATION.EXPIRY_INVALID });
    }

    // CVV 검증
    if (!cardDetails.cvv || cardDetails.cvv.length < CARD_VALIDATION.CVV_LENGTH) {
      errors.push({ field: 'cvv', message: PAYMENT_ERROR_MESSAGES.VALIDATION.CVV_INVALID });
    }

    // 카드 소유자명 검증
    if (!cardDetails.name.trim()) {
      errors.push({ field: 'name', message: PAYMENT_ERROR_MESSAGES.VALIDATION.CARD_HOLDER_REQUIRED });
    }

    return errors;
  }

  calculateDiscountedPrice(product: SubscriptionProduct, coupon?: Coupon): number {
    const price = parseInt(product.price.replace(/[^\d]/g, ''));
    const discount = coupon ? Math.min(coupon.discountPercent, PAYMENT_LIMITS.MAX_DISCOUNT_PERCENT) : 0;
    return price * (1 - discount / 100);
  }

  calculatePaymentFee(amount: number, paymentMethod: string): number {
    switch (paymentMethod) {
      case 'card':
        return amount * (PAYMENT_FEES.CARD_FEE_PERCENT / 100);
      case 'mobile_payment':
        return amount * (PAYMENT_FEES.MOBILE_PAYMENT_FEE_PERCENT / 100);
      case 'digital_wallet':
        return amount * (PAYMENT_FEES.DIGITAL_WALLET_FEE_PERCENT / 100);
      case 'bank_transfer':
        return PAYMENT_FEES.BANK_TRANSFER_FEE;
      default:
        return 0;
    }
  }

  validatePaymentRequest(request: PaymentRequest): PaymentValidationError[] {
    const errors: PaymentValidationError[] = [];

    // 상품 ID 검증
    if (!request.productId) {
      errors.push({ field: 'productId', message: PAYMENT_ERROR_MESSAGES.VALIDATION.PRODUCT_REQUIRED });
    }

    // 결제 방법 검증
    if (!request.paymentMethod) {
      errors.push({ field: 'paymentMethod', message: PAYMENT_ERROR_MESSAGES.VALIDATION.PAYMENT_METHOD_REQUIRED });
    }

    // 카드 결제인 경우 카드 정보 검증
    if (request.paymentMethod === 'card' && request.cardDetails) {
      const cardErrors = this.validateCardDetails(request.cardDetails);
      errors.push(...cardErrors);
    }

    // 금액 검증 (productId로부터 상품 정보를 가져와서 검증하는 것이 더 적절)
    // 여기서는 기본적인 검증만 수행

    return errors;
  }

  async processRefund(paymentId: string, amount: number, reason: string): Promise<PaymentResponse> {
    try {
      const refund = await this.paymentRepository.refundPayment(paymentId, amount);
      
      // 환불 성공 시 관련 캐시 무효화
      this.invalidatePaymentCache();
      
      return refund;
    } catch (error) {
      console.error('Failed to process refund:', error);
      throw new Error('환불 처리에 실패했습니다.');
    }
  }

  // Private helper methods
  private invalidatePaymentCache(): void {
    this.cache.delete('subscription_products');
    this.cache.delete('payment_methods');
    this.cache.delete('coupon:*');
    this.cache.delete('saved_methods:*');
  }
} 