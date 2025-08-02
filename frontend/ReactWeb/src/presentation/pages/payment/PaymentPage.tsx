import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { 
  Header, 
  EmptyState,
  ErrorDisplay,
  SectionHeader,
  ActionButton,
  SubscriptionFooter,
  PaymentPageContainer,
  PaymentContentContainer,
  PaymentMethodSection,
  PaymentButtonContainer,
  HeaderContainer
} from '../../components/common';
import { 
  ProductGrid,
  LoadingState,
  PaymentMethodSelector
} from '../../components/specific';
import type {SubscriptionProduct, PaymentMethod} from '../../../domain/types';

const PaymentSubscriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasePending, setPurchasePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('');

  const paymentMethods: PaymentMethod[] = [
    {
      id: 'card',
      name: '신용카드',
      icon: '💳',
      description: 'Visa, MasterCard, American Express',
      isAvailable: true
    },
    {
      id: 'bank_transfer',
      name: '계좌이체',
      icon: '🏦',
      description: '실시간 계좌이체',
      isAvailable: true
    },
    {
      id: 'mobile_payment',
      name: '모바일 결제',
      icon: '📱',
      description: '카카오페이, 네이버페이, 페이코',
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

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);

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

      setProducts(mockProducts);
      setIsAvailable(true);
    } catch (err) {
      console.error('Failed to fetch products:', err);
      setError('구독 상품을 불러오는데 실패했습니다.');
      setIsAvailable(false);
    } finally {
      setIsLoading(false);
    }
  };

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
      setPurchasePending(true);

      // TODO: 실제 결제 API 호출로 대체
      // await purchaseSubscription(selectedProduct.id, selectedPaymentMethod);

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`${selectedProduct.title} 구독이 완료되었습니다!`);
      navigate(ROUTES.HOME);

    } catch (err) {
      console.error('Purchase failed:', err);
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
    } finally {
      setPurchasePending(false);
    }
  };

  if (purchasePending) {
    return (
      <LoadingState message={t('processing_payment') || '결제를 처리하는 중...'} />
    );
  }

  if (error) {
    return (
      <ErrorDisplay
        icon="❌"
        title={t('payment_error') || '결제 오류'}
        message={error}
        action={{
          label: t('retry') || '다시 시도',
          onClick: fetchProducts
        }}
      />
    );
  }

  if (!isAvailable) {
    return (
      <ErrorDisplay
        icon="⚠️"
        title={t('store_unavailable') || '스토어를 사용할 수 없습니다'}
        message="기기에서 Google Play/Apple App Store에 로그인되어 있는지, 네트워크 연결 상태, 인앱결제 상품 등록 여부를 확인하세요."
        action={{
          label: t('retry') || '다시 시도',
          onClick: fetchProducts
        }}
      />
    );
  }

  return (
    <PaymentPageContainer>
      {/* Header */}
      <HeaderContainer>
        <Header
          title={t('subscription_plans') || '구독 플랜'}
          showBackButton
        />
      </HeaderContainer>

      {/* Content */}
      <PaymentContentContainer>
        {isLoading ? (
          <LoadingState />
        ) : products.length === 0 ? (
          <EmptyState
            icon="📦"
            title={t('no_products') || '구독 상품이 없습니다'}
            description={t('no_products_description') || '현재 이용 가능한 구독 상품이 없습니다.'}
          />
        ) : (
          <>
            {/* Header Info */}
            <SectionHeader
              title={t('choose_your_plan') || '나에게 맞는 플랜을 선택하세요'}
              description={t('subscription_description') || '더 많은 포인트와 고급 기능으로 AI 상담을 더욱 풍부하게 경험해보세요.'}
              centered
            />

            {/* Products Grid */}
            <ProductGrid
              products={products}
              onPurchase={handleProductSelect}
              purchasePending={purchasePending}
            />

            {/* Payment Method Selection */}
            {selectedProduct && (
              <PaymentMethodSection>
                <PaymentMethodSelector
                  methods={paymentMethods}
                  selectedMethod={selectedPaymentMethod}
                  onMethodSelect={handlePaymentMethodSelect}
                />
                
                <PaymentButtonContainer>
                  <ActionButton
                    onClick={handlePurchase}
                    disabled={!selectedPaymentMethod}
                    loading={purchasePending}
                    size="lg"
                  >
                    {purchasePending ? '처리 중...' : `${selectedProduct.price}로 구독하기`}
                  </ActionButton>
                </PaymentButtonContainer>
              </PaymentMethodSection>
            )}

            {/* Footer Info */}
            <SubscriptionFooter />
          </>
        )}
      </PaymentContentContainer>
    </PaymentPageContainer>
  );
};

export default PaymentSubscriptionScreen;
