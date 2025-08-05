import type { IPaymentRepository } from '../interfaces/IPaymentRepository';
import type { IPaymentUseCase } from '../interfaces/IPaymentUseCase';
import type { ICache } from '../interfaces/ICache';
import { PaymentService } from '../services/PaymentService';
import { PaymentUseCase } from '../PaymentUseCase';

// 의존성 주입을 위한 팩토리 함수
export const createPaymentUseCase = (
  repository: IPaymentRepository, 
  cache?: ICache
): IPaymentUseCase => {
  const service = new PaymentService(repository, cache);
  return new PaymentUseCase(service);
};

// 테스트를 위한 Mock 팩토리
export const createMockPaymentUseCase = (): IPaymentUseCase => {
  const mockRepository: IPaymentRepository = {
    getSubscriptionProducts: async () => [],
    getPaymentMethods: async () => [],
    validateCoupon: async () => null,
    processPayment: async () => ({ 
      id: 'mock-payment-id', 
      status: 'completed', 
      amount: 0, 
      currency: 'KRW',
      timestamp: new Date(),
      success: true,
      message: 'Payment processed successfully'
    }),
    getPaymentHistory: async () => [],
    refundPayment: async () => ({ 
      id: 'mock-refund-id', 
      status: 'completed', 
      amount: 0, 
      currency: 'KRW',
      timestamp: new Date(),
      success: true,
      message: 'Refund processed successfully'
    }),
    getPaymentStatus: async () => 'completed',
    savePaymentMethod: async () => {},
    getSavedPaymentMethods: async () => [],
  };
  
  return createPaymentUseCase(mockRepository);
}; 