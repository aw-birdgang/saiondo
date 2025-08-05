
export interface PaymentConfig {
  apiKey: string;
  merchantId: string;
  baseUrl: string;
  token: string;
}

export interface PaymentItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  description?: string;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  items: PaymentItem[];
  customerEmail: string;
  customerName: string;
  successUrl: string;
  cancelUrl: string;
  metadata?: Record<string, any>;
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  paymentUrl?: string;
  error?: string;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
}

export interface PaymentStatus {
  paymentId: string;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  amount: number;
  currency: string;
  createdAt: Date;
  updatedAt: Date;
  metadata?: Record<string, any>;
}

export class PaymentService {
  private config: PaymentConfig;

  constructor(config: PaymentConfig) {
    this.config = config;
  }

  /**
   * 결제 요청 생성
   */
  async createPayment(paymentRequest: PaymentRequest): Promise<PaymentResponse> {
    try {
      // TODO: 실제 결제 API 호출로 대체
      // const response = await fetch(`${this.config.baseUrl}/payments`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.config.token}`,
      //     'Content-Type': 'application/json',
      //     'X-API-Key': this.config.apiKey
      //   },
      //   body: JSON.stringify({
      //     merchant_id: this.config.merchantId,
      //     ...paymentRequest
      //   })
      // });
      // return response.json();

      // 임시 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 임시 결제 응답
      const paymentId = crypto.randomUUID();
      const paymentUrl = `${window.location.origin}/payment/process/${paymentId}`;

      return {
        success: true,
        paymentId,
        paymentUrl,
        status: 'pending'
      };

    } catch (error) {
      console.error('Payment creation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 요청 생성에 실패했습니다.'
      };
    }
  }

  /**
   * 결제 상태 확인
   */
  async getPaymentStatus(paymentId: string): Promise<PaymentStatus | null> {
    try {
      // TODO: 실제 결제 상태 API 호출로 대체
      // const response = await fetch(`${this.config.baseUrl}/payments/${paymentId}`, {
      //   headers: {
      //     'Authorization': `Bearer ${this.config.token}`,
      //     'X-API-Key': this.config.apiKey
      //   }
      // });
      // return response.json();

      // 임시 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 500));

      // 임시 결제 상태 (랜덤하게 완료 또는 실패)
      const isCompleted = Math.random() > 0.3; // 70% 확률로 완료

      return {
        paymentId,
        status: isCompleted ? 'completed' : 'failed',
        amount: 10000, // 10,000원
        currency: 'KRW',
        createdAt: new Date(Date.now() - 1000 * 60 * 5), // 5분 전
        updatedAt: new Date(),
        metadata: {
          orderId: `order-${Date.now()}`,
          customerEmail: 'user@example.com'
        }
      };

    } catch (error) {
      console.error('Payment status check failed:', error);
      return null;
    }
  }

  /**
   * 결제 취소
   */
  async cancelPayment(paymentId: string, reason?: string): Promise<PaymentResponse> {
    try {
      // TODO: 실제 결제 취소 API 호출로 대체
      // const response = await fetch(`${this.config.baseUrl}/payments/${paymentId}/cancel`, {
      //   method: 'POST',
      //   headers: {
      //     'Authorization': `Bearer ${this.config.token}`,
      //     'Content-Type': 'application/json',
      //     'X-API-Key': this.config.apiKey
      //   },
      //   body: JSON.stringify({ reason })
      // });
      // return response.json();

      // 임시 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 800));

      return {
        success: true,
        paymentId,
        status: 'cancelled'
      };

    } catch (error) {
      console.error('Payment cancellation failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : '결제 취소에 실패했습니다.'
      };
    }
  }

  /**
   * 결제 내역 조회
   */
  async getPaymentHistory(
    page: number = 1,
    limit: number = 20,
    status?: string
  ): Promise<{ payments: PaymentStatus[]; total: number; hasMore: boolean }> {
    try {
      // TODO: 실제 결제 내역 API 호출로 대체
      // const response = await fetch(
      //   `${this.config.baseUrl}/payments?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`,
      //   {
      //     headers: {
      //       'Authorization': `Bearer ${this.config.token}`,
      //       'X-API-Key': this.config.apiKey
      //     }
      //   }
      // );
      // return response.json();

      // 임시 지연 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 600));

      // 임시 결제 내역 데이터
      const payments: PaymentStatus[] = Array.from({ length: limit }, (_, index) => ({
        paymentId: crypto.randomUUID(),
        status: ['completed', 'failed', 'cancelled'][Math.floor(Math.random() * 3)] as any,
        amount: Math.floor(Math.random() * 50000) + 5000, // 5,000원 ~ 55,000원
        currency: 'KRW',
        createdAt: new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30), // 최근 30일
        updatedAt: new Date(),
        metadata: {
          orderId: `order-${Date.now()}-${index}`,
          customerEmail: 'user@example.com'
        }
      }));

      return {
        payments,
        total: 150, // 총 150개의 결제 내역
        hasMore: page * limit < 150
      };

    } catch (error) {
      console.error('Payment history fetch failed:', error);
      return {
        payments: [],
        total: 0,
        hasMore: false
      };
    }
  }

  /**
   * 결제 금액 포맷팅
   */
  formatAmount(amount: number, currency: string = 'KRW'): string {
    if (currency === 'KRW') {
      return new Intl.NumberFormat('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      }).format(amount);
    }
    
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }

  /**
   * 결제 상태에 따른 메시지 반환
   */
  getStatusMessage(status: string): string {
    switch (status) {
      case 'pending':
        return '결제 대기 중';
      case 'completed':
        return '결제 완료';
      case 'failed':
        return '결제 실패';
      case 'cancelled':
        return '결제 취소됨';
      default:
        return '알 수 없는 상태';
    }
  }

  /**
   * 결제 상태에 따른 색상 반환
   */
  getStatusColor(status: string): string {
    switch (status) {
      case 'pending':
        return 'text-yellow-600';
      case 'completed':
        return 'text-green-600';
      case 'failed':
        return 'text-red-600';
      case 'cancelled':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  }
}

// 기본 설정
const defaultConfig: PaymentConfig = {
  apiKey: import.meta.env.VITE_PAYMENT_API_KEY || '',
  merchantId: import.meta.env.VITE_PAYMENT_MERCHANT_ID || '',
  baseUrl: import.meta.env.VITE_PAYMENT_BASE_URL || 'https://api.payment.com',
  token: ''
};

// 전역 인스턴스
let paymentService: PaymentService | null = null;

/**
 * 결제 서비스 초기화
 */
export const initializePaymentService = (token: string): PaymentService => {
  const config = { ...defaultConfig, token };
  paymentService = new PaymentService(config);
  return paymentService;
};

/**
 * 결제 서비스 가져오기
 */
export const getPaymentService = (): PaymentService | null => {
  return paymentService;
};

/**
 * 결제 훅
 */
export const usePayment = () => {
  const createPayment = async (paymentRequest: PaymentRequest): Promise<PaymentResponse> => {
    const service = getPaymentService();
    if (!service) {
      return {
        success: false,
        error: '결제 서비스가 초기화되지 않았습니다.'
      };
    }

    return service.createPayment(paymentRequest);
  };

  const getPaymentStatus = async (paymentId: string): Promise<PaymentStatus | null> => {
    const service = getPaymentService();
    if (!service) {
      return null;
    }

    return service.getPaymentStatus(paymentId);
  };

  const cancelPayment = async (paymentId: string, reason?: string): Promise<PaymentResponse> => {
    const service = getPaymentService();
    if (!service) {
      return {
        success: false,
        error: '결제 서비스가 초기화되지 않았습니다.'
      };
    }

    return service.cancelPayment(paymentId, reason);
  };

  const getPaymentHistory = async (
    page?: number,
    limit?: number,
    status?: string
  ) => {
    const service = getPaymentService();
    if (!service) {
      return {
        payments: [],
        total: 0,
        hasMore: false
      };
    }

    return service.getPaymentHistory(page, limit, status);
  };

  return {
    createPayment,
    getPaymentStatus,
    cancelPayment,
    getPaymentHistory
  };
}; 