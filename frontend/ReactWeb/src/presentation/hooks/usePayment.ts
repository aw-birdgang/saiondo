import { useState, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../shared/constants/app';
import { useToastContext } from '../providers/ToastProvider';
import type {
  PaymentState,
  PaymentStep,
  SubscriptionProduct,
  CardDetails,
  PaymentRequest,
} from '../../domain/types/payment';
import type { IPaymentUseCase } from '../../application/usecases/PaymentUseCase';

const PAYMENT_STEPS: PaymentStep[] = [
  {
    id: 'product',
    title: '플랜 선택',
    description: '구독 플랜을 선택하세요',
    progress: 25,
  },
  {
    id: 'payment',
    title: '결제 정보',
    description: '결제 방법과 정보를 입력하세요',
    progress: 50,
  },
  {
    id: 'confirmation',
    title: '확인',
    description: '주문 정보를 확인하세요',
    progress: 75,
  },
  {
    id: 'processing',
    title: '처리 중',
    description: '결제를 처리하고 있습니다',
    progress: 90,
  },
  {
    id: 'complete',
    title: '완료',
    description: '결제가 완료되었습니다',
    progress: 100,
  },
];

export const usePayment = (paymentUseCase: IPaymentUseCase) => {
  const navigate = useNavigate();
  const toast = useToastContext();

  const [state, setState] = useState<PaymentState>({
    currentStep: 'product',
    selectedProduct: null,
    selectedPaymentMethod: 'card',
    couponCode: '',
    appliedCoupon: null,
    cardDetails: {
      number: '',
      expiry: '',
      cvv: '',
      name: '',
    },
    isProcessing: false,
    paymentProgress: 0,
    error: null,
  });

  // 현재 단계 정보
  const currentStepInfo = useMemo(
    () =>
      PAYMENT_STEPS.find(step => step.id === state.currentStep) ||
      PAYMENT_STEPS[0],
    [state.currentStep]
  );

  // 할인된 가격 계산
  const discountedPrice = useMemo(() => {
    if (!state.selectedProduct) return 0;
    return paymentUseCase.calculateDiscountedPrice(
      state.selectedProduct,
      state.appliedCoupon || undefined
    );
  }, [state.selectedProduct, state.appliedCoupon, paymentUseCase]);

  // 상품 선택
  const selectProduct = useCallback((product: SubscriptionProduct) => {
    setState(prev => ({
      ...prev,
      selectedProduct: product,
      currentStep: 'payment',
    }));
  }, []);

  // 결제 방법 선택
  const selectPaymentMethod = useCallback((methodId: string) => {
    setState(prev => ({
      ...prev,
      selectedPaymentMethod: methodId,
    }));
  }, []);

  // 카드 정보 업데이트
  const updateCardDetails = useCallback(
    (field: keyof CardDetails, value: string) => {
      setState(prev => ({
        ...prev,
        cardDetails: {
          ...prev.cardDetails,
          [field]: value,
        },
      }));
    },
    []
  );

  // 쿠폰 코드 업데이트
  const updateCouponCode = useCallback((code: string) => {
    setState(prev => ({
      ...prev,
      couponCode: code,
    }));
  }, []);

  // 쿠폰 적용
  const applyCoupon = useCallback(async () => {
    if (!state.couponCode.trim()) {
      toast.error('쿠폰 코드를 입력해주세요.');
      return;
    }

    try {
      const coupon = await paymentUseCase.validateCoupon(state.couponCode);
      if (coupon) {
        setState(prev => ({
          ...prev,
          appliedCoupon: coupon,
        }));
        toast.success('쿠폰이 적용되었습니다!');
      } else {
        toast.error('유효하지 않은 쿠폰 코드입니다.');
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : '쿠폰 적용에 실패했습니다.'
      );
    }
  }, [state.couponCode, paymentUseCase, toast]);

  // 쿠폰 제거
  const removeCoupon = useCallback(() => {
    setState(prev => ({
      ...prev,
      appliedCoupon: null,
      couponCode: '',
    }));
    toast.success('쿠폰이 제거되었습니다.');
  }, [toast]);

  // 다음 단계로 이동
  const goToNextStep = useCallback(() => {
    const currentIndex = PAYMENT_STEPS.findIndex(
      step => step.id === state.currentStep
    );
    if (currentIndex < PAYMENT_STEPS.length - 1) {
      const nextStep = PAYMENT_STEPS[currentIndex + 1];
      setState(prev => ({
        ...prev,
        currentStep: nextStep.id,
      }));
    }
  }, [state.currentStep]);

  // 이전 단계로 이동
  const goToPreviousStep = useCallback(() => {
    const currentIndex = PAYMENT_STEPS.findIndex(
      step => step.id === state.currentStep
    );
    if (currentIndex > 0) {
      const prevStep = PAYMENT_STEPS[currentIndex - 1];
      setState(prev => ({
        ...prev,
        currentStep: prevStep.id,
      }));
    }
  }, [state.currentStep]);

  // 특정 단계로 이동
  const goToStep = useCallback((stepId: PaymentStep['id']) => {
    setState(prev => ({
      ...prev,
      currentStep: stepId,
    }));
  }, []);

  // 결제 진행
  const processPayment = useCallback(async () => {
    if (!state.selectedProduct) {
      toast.error('상품을 선택해주세요.');
      return;
    }

    setState(prev => ({
      ...prev,
      isProcessing: true,
      currentStep: 'processing',
      error: null,
    }));

    try {
      // 결제 진행률 시뮬레이션
      for (let i = 0; i <= 100; i += 10) {
        setState(prev => ({ ...prev, paymentProgress: i }));
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const paymentRequest: PaymentRequest = {
        productId: state.selectedProduct.id,
        paymentMethod: state.selectedPaymentMethod,
        couponCode: state.appliedCoupon?.code,
        cardDetails:
          state.selectedPaymentMethod === 'card'
            ? state.cardDetails
            : undefined,
      };

      const response = await paymentUseCase.processPayment(paymentRequest);

      if (response.success) {
        setState(prev => ({
          ...prev,
          currentStep: 'complete',
        }));
        toast.success(response.message);

        // 완료 후 홈으로 이동
        setTimeout(() => {
          navigate(ROUTES.HOME);
        }, 2000);
      } else {
        throw new Error(response.message);
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : '결제에 실패했습니다.';
      setState(prev => ({
        ...prev,
        error: errorMessage,
        currentStep: 'payment',
      }));
      toast.error(errorMessage);
    } finally {
      setState(prev => ({
        ...prev,
        isProcessing: false,
        paymentProgress: 0,
      }));
    }
  }, [state, paymentUseCase, toast, navigate]);

  // 에러 초기화
  const clearError = useCallback(() => {
    setState(prev => ({
      ...prev,
      error: null,
    }));
  }, []);

  // 상태 초기화
  const reset = useCallback(() => {
    setState({
      currentStep: 'product',
      selectedProduct: null,
      selectedPaymentMethod: 'card',
      couponCode: '',
      appliedCoupon: null,
      cardDetails: {
        number: '',
        expiry: '',
        cvv: '',
        name: '',
      },
      isProcessing: false,
      paymentProgress: 0,
      error: null,
    });
  }, []);

  return {
    // State
    state,
    currentStepInfo,
    discountedPrice,

    // Actions
    selectProduct,
    selectPaymentMethod,
    updateCardDetails,
    updateCouponCode,
    applyCoupon,
    removeCoupon,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    processPayment,
    clearError,
    reset,
  };
};
