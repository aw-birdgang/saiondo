import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
  PaymentRequest,
  PaymentResponse,
} from '../../domain/types/payment';
import type { IPaymentRepository } from '../../application/usecases/PaymentUseCase';

export class PaymentRepository implements IPaymentRepository {
  async getSubscriptionProducts(): Promise<SubscriptionProduct[]> {
    // 실제 API 호출 대신 목업 데이터 반환
    await new Promise(resolve => setTimeout(resolve, 1000));

    return [
      {
        id: 'basic_monthly',
        title: '기본 월간 구독',
        description: '월 1,000포인트 제공',
        price: '₩9,900',
        originalPrice: '₩12,900',
        discount: '23% 할인',
        period: 'monthly',
        points: 1000,
        features: [
          '월 1,000포인트 제공',
          '기본 AI 상담 서비스',
          '채팅 히스토리 저장',
          '이메일 지원',
        ],
        popular: false,
      },
      {
        id: 'premium_monthly',
        title: '프리미엄 월간 구독',
        description: '월 3,000포인트 제공',
        price: '₩19,900',
        originalPrice: '₩29,900',
        discount: '33% 할인',
        period: 'monthly',
        points: 3000,
        features: [
          '월 3,000포인트 제공',
          '고급 AI 상담 서비스',
          '무제한 채팅',
          '우선 고객 지원',
          '고급 분석 기능',
          '개인화된 추천',
        ],
        popular: true,
      },
      {
        id: 'premium_yearly',
        title: '프리미엄 연간 구독',
        description: '연 36,000포인트 제공',
        price: '₩199,900',
        originalPrice: '₩358,800',
        discount: '44% 할인',
        period: 'yearly',
        points: 36000,
        features: [
          '연 36,000포인트 제공',
          '고급 AI 상담 서비스',
          '무제한 채팅',
          '우선 고객 지원',
          '고급 분석 기능',
          '개인화된 추천',
          '2개월 무료',
        ],
        popular: false,
      },
    ];
  }

  async getPaymentMethods(): Promise<PaymentMethod[]> {
    return [
      {
        id: 'card',
        name: '신용카드',
        icon: '💳',
        description: 'Visa, Mastercard, Amex',
        isAvailable: true,
      },
      {
        id: 'bank',
        name: '계좌이체',
        icon: '🏦',
        description: '실시간 계좌이체',
        isAvailable: true,
      },
      {
        id: 'mobile',
        name: '휴대폰 결제',
        icon: '📱',
        description: '통신사 결제',
        isAvailable: true,
      },
      {
        id: 'crypto',
        name: '암호화폐',
        icon: '₿',
        description: 'Bitcoin, Ethereum',
        isAvailable: false,
      },
    ];
  }

  async validateCoupon(code: string): Promise<Coupon | null> {
    // 실제 API 호출 대신 목업 검증
    await new Promise(resolve => setTimeout(resolve, 500));

    const validCoupons: Record<string, Coupon> = {
      WELCOME10: {
        code: 'WELCOME10',
        discountPercent: 10,
        description: '신규 가입 10% 할인',
        isValid: true,
        expiresAt: '2024-12-31',
      },
      SAVE20: {
        code: 'SAVE20',
        discountPercent: 20,
        description: '20% 할인 쿠폰',
        isValid: true,
        expiresAt: '2024-12-31',
      },
    };

    return validCoupons[code] || null;
  }

  async processPayment(request: PaymentRequest): Promise<PaymentResponse> {
    // 결제 진행 시뮬레이션
    await new Promise(resolve => setTimeout(resolve, 2000));

    // 성공 확률 90%로 시뮬레이션
    const isSuccess = Math.random() > 0.1;

    if (isSuccess) {
      return {
        success: true,
        transactionId: `TXN_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        message: '결제가 성공적으로 완료되었습니다.',
      };
    } else {
      return {
        success: false,
        message: '결제에 실패했습니다. 다시 시도해주세요.',
        error: 'PAYMENT_FAILED',
      };
    }
  }
}
