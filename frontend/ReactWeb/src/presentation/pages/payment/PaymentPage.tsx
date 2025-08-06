import React, { useEffect, useState } from 'react';
// import { useTranslation } from 'react-i18next';
import { getContainer } from '@/di/container';
import { DI_TOKENS } from '@/di/tokens';
import { usePayment } from '@/presentation/hooks/usePayment';
import { useDataLoader } from '@/presentation/hooks/useDataLoader';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import {
  ProductSelectionStep,
  PaymentMethodStep,
  ConfirmationStep,
  ProcessingStep,
  CompleteStep,
  PaymentProgress,
} from '@/presentation/components/payment';
import type { PaymentUseCase } from '@/application/usecases/PaymentUseCase';
import type { PaymentStep } from '@/domain/types/payment';

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

const PaymentPage: React.FC = () => {
  // const { t } = useTranslation();
  const toast = useToastContext();
  const container = getContainer();

  // Payment Use Case 가져오기
      const [paymentUseCase] = useState<PaymentUseCase>(() =>
    container.get<PaymentUseCase>(DI_TOKENS.PAYMENT_USE_CASE)
  );

  // Payment 상태 관리 훅
  const {
    state,
    // currentStepInfo,
    discountedPrice,
    selectProduct,
    selectPaymentMethod,
    updateCardDetails,
    updateCouponCode,
    applyCoupon,
    removeCoupon,
    goToNextStep,
    goToPreviousStep,
    processPayment,
    clearError,
    // reset,
  } = usePayment(paymentUseCase);

  // 상품 데이터 로딩
  const {
    data: products = [],
    loading: isLoadingProducts,
    error: productsError,
    refresh: refetchProducts,
  } = useDataLoader(() => paymentUseCase.getSubscriptionProducts(), [], {
    autoLoad: true,
    errorMessage: '구독 상품을 불러오는데 실패했습니다.',
  });

  // 결제 방법 데이터 로딩
  const {
    data: paymentMethods = [],
    loading: isLoadingPaymentMethods,
    error: paymentMethodsError,
  } = useDataLoader(() => paymentUseCase.getPaymentMethods(), [], {
    autoLoad: true,
    errorMessage: '결제 방법을 불러오는데 실패했습니다.',
  });

  // 에러 처리
  useEffect(() => {
    if (state.error) {
      toast.error(state.error);
      clearError();
    }
  }, [state.error, toast, clearError]);

  // 결제 방법 선택된 결제 방법 정보
  const selectedPaymentMethodInfo = paymentMethods?.find(
    method => method.id === state.selectedPaymentMethod
  );

  // 현재 단계에 따른 컴포넌트 렌더링
  const renderCurrentStep = () => {
    switch (state.currentStep) {
      case 'product':
        return (
          <ProductSelectionStep
            products={products || []}
            isLoading={isLoadingProducts}
            error={productsError}
            onProductSelect={selectProduct}
            onRetry={() => refetchProducts?.()}
          />
        );

      case 'payment':
        return (
          <PaymentMethodStep
            paymentMethods={paymentMethods || []}
            selectedPaymentMethod={state.selectedPaymentMethod}
            cardDetails={state.cardDetails}
            couponCode={state.couponCode}
            appliedCoupon={state.appliedCoupon}
            onPaymentMethodSelect={selectPaymentMethod}
            onCardDetailsChange={updateCardDetails}
            onCouponCodeChange={updateCouponCode}
            onApplyCoupon={applyCoupon}
            onRemoveCoupon={removeCoupon}
            onNext={goToNextStep}
            onPrevious={goToPreviousStep}
          />
        );

      case 'confirmation':
        if (!state.selectedProduct || !selectedPaymentMethodInfo) {
          return null;
        }
        return (
          <ConfirmationStep
            selectedProduct={state.selectedProduct}
            selectedPaymentMethod={selectedPaymentMethodInfo}
            appliedCoupon={state.appliedCoupon}
            discountedPrice={discountedPrice}
            onPrevious={goToPreviousStep}
            onConfirm={processPayment}
            isProcessing={state.isProcessing}
          />
        );

      case 'processing':
        return <ProcessingStep progress={state.paymentProgress} />;

      case 'complete':
        return <CompleteStep onGoHome={() => (window.location.href = '/')} />;

      default:
        return null;
    }
  };

  // 로딩 상태 처리
  if (isLoadingProducts || isLoadingPaymentMethods) {
    return (
      <div className='min-h-screen bg-bg flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4'></div>
          <p className='text-txt-secondary'>결제 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러 상태 처리
  if (productsError || paymentMethodsError) {
    return (
      <div className='min-h-screen bg-bg flex items-center justify-center'>
        <div className='text-center'>
          <h2 className='text-xl font-semibold text-txt mb-2'>
            데이터 로딩 오류
          </h2>
          <p className='text-txt-secondary mb-4'>
            {productsError || paymentMethodsError}
          </p>
          <button
            onClick={() => {
              if (productsError) refetchProducts();
              window.location.reload();
            }}
            className='px-4 py-2 bg-primary text-white rounded hover:bg-primary/90'
          >
            다시 시도
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-bg'>
      {/* 진행률 표시 */}
      <PaymentProgress currentStep={state.currentStep} steps={PAYMENT_STEPS} />

      {/* 메인 콘텐츠 */}
      <div className='max-w-4xl mx-auto p-6'>{renderCurrentStep()}</div>
    </div>
  );
};

export default PaymentPage;
