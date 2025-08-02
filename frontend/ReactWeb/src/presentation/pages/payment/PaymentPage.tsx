import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from "../../../stores/authStore";
import { useDataLoader } from '../../hooks/useDataLoader';
import { LoadingState, PaymentMethodSelector, ProductCard, PurchaseConfirmation, ProductGrid } from '../../components/specific';
import { PageHeader, PageContainer } from '../../components/layout';
import { PaymentPageContainer, PaymentSection } from '../../components/common';
import type { SubscriptionProduct, PaymentMethod } from '../../../domain/types';

const PaymentSubscriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [isAvailable, setIsAvailable] = useState(false);

  // Use custom hook for data loading
  const { data: products = [], loading: isLoading, error } = useDataLoader(
    async () => {
      // TODO: 실제 API 호출로 대체
      // const response = await getSubscriptionProducts();

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Mock 데이터
      const mockProducts: SubscriptionProduct[] = [
        {
          id: 'basic_monthly',
          title: '기본 월간 구독',
          description: '월 1,000포인트 제공',
          price: '₩9,900',
          originalPrice: '₩12,900',
          discount: '23% 할인',
          features: [
            '월 1,000포인트 제공',
            '기본 AI 상담 서비스',
            '채팅 히스토리 저장',
            '이메일 지원',
          ],
        },
        {
          id: 'premium_monthly',
          title: '프리미엄 월간 구독',
          description: '월 3,000포인트 제공',
          price: '₩19,900',
          originalPrice: '₩29,900',
          discount: '33% 할인',
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
          features: [
            '연 36,000포인트 제공',
            '고급 AI 상담 서비스',
            '무제한 채팅',
            '우선 고객 지원',
            '고급 분석 기능',
            '개인화된 추천',
            '2개월 무료',
          ],
        },
      ];

      setIsAvailable(true);
      return mockProducts;
    },
    [],
    {
      autoLoad: true,
      errorMessage: '구독 상품을 불러오는데 실패했습니다.'
    }
  );

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: '신용카드',
      icon: '💳',
      description: 'Visa, Mastercard, Amex',
      isAvailable: true
    },
    {
      id: 'bank',
      name: '계좌이체',
      icon: '🏦',
      description: '실시간 계좌이체',
      isAvailable: true
    },
    {
      id: 'mobile',
      name: '휴대폰 결제',
      icon: '📱',
      description: '통신사 결제',
      isAvailable: true
    },
    {
      id: 'crypto',
      name: '암호화폐',
      icon: '₿',
      description: 'Bitcoin, Ethereum',
      isAvailable: false
    }
  ];

  const handleProductSelect = (product: SubscriptionProduct) => {
    setSelectedProduct(product);
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePurchase = async () => {
    if (!selectedProduct) {
      toast.error('구독 상품을 선택해주세요.');
      return;
    }

    if (!selectedPaymentMethod) {
      toast.error('결제 방법을 선택해주세요.');
      return;
    }

    try {
      // TODO: 실제 결제 API 호출
      // await processPayment({
      //   productId: selectedProduct.id,
      //   paymentMethod: selectedPaymentMethod,
      //   userId: user?.id
      // });

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success('구독이 성공적으로 완료되었습니다!');
      navigate(ROUTES.HOME);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
    }
  };

  if (isLoading) {
    return (
      <LoadingState message={t('loading_products') || '구독 상품을 불러오는 중...'} />
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            {t('error_loading_products') || '상품 로딩 오류'}
          </h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {t('retry') || '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <PaymentPageContainer>
      {/* Header */}
      <PageHeader
        title={t('subscription') || '구독'}
        subtitle={t('choose_your_plan') || '원하는 플랜을 선택하세요'}
        showBackButton
      />

      {/* Content */}
      <PageContainer>
        {/* Product Selection */}
        <PaymentSection>
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            {t('select_plan') || '플랜 선택'}
          </h2>
          <ProductGrid
            products={products || []}
            onPurchase={handleProductSelect}
            purchasePending={false}
          />
        </PaymentSection>

        {/* Payment Method Selection */}
        {selectedProduct && (
          <PaymentSection>
            <h2 className="text-2xl font-bold text-gray-800 mb-6">
              {t('payment_method') || '결제 방법'}
            </h2>
            <PaymentMethodSelector
              methods={paymentMethods}
              selectedMethod={selectedPaymentMethod}
              onMethodSelect={handlePaymentMethodSelect}
            />
          </PaymentSection>
        )}

        {/* Purchase Confirmation */}
        {selectedProduct && selectedPaymentMethod && (
          <PurchaseConfirmation
            product={selectedProduct}
            isOpen={true}
            onClose={() => setSelectedProduct(null)}
            onConfirm={handlePurchase}
            isProcessing={false}
          />
        )}
      </PageContainer>
    </PaymentPageContainer>
  );
};

export default PaymentSubscriptionScreen;
