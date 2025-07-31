import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import { 
  Header, 
  EmptyState,
  LoadingSpinner
} from '../../components/common';
import { 
  ProductCard 
} from '../../components/specific/payment';
import { 
  LoadingState 
} from '../../components/specific/test';

interface SubscriptionProduct {
  id: string;
  title: string;
  description: string;
  price: string;
  originalPrice?: string;
  discount?: string;
  features: string[];
  popular?: boolean;
}

const PaymentSubscriptionScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [products, setProducts] = useState<SubscriptionProduct[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [purchasePending, setPurchasePending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState(true);

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

  const handlePurchase = async (product: SubscriptionProduct) => {
    try {
      setPurchasePending(true);

      // TODO: 실제 결제 API 호출로 대체
      // await purchaseSubscription(product.id);

      // 시뮬레이션을 위한 지연
      await new Promise(resolve => setTimeout(resolve, 2000));

      toast.success(`${product.title} 구독이 완료되었습니다!`);
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
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-400">
            {t('processing_payment') || '결제를 처리하는 중...'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('payment_error') || '결제 오류'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {error}
          </p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('retry') || '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  if (!isAvailable) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="text-center max-w-md mx-auto px-4">
          <div className="text-6xl mb-4">⚠️</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            {t('store_unavailable') || '스토어를 사용할 수 없습니다'}
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
            기기에서 Google Play/Apple App Store에 로그인되어 있는지,<br />
            네트워크 연결 상태, 인앱결제 상품 등록 여부를 확인하세요.
          </p>
          <button
            onClick={fetchProducts}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
          >
            {t('retry') || '다시 시도'}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <Header
        title={t('subscription_plans') || '구독 플랜'}
        showBackButton
        className="max-w-4xl mx-auto"
      />

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
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
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
                {t('choose_your_plan') || '나에게 맞는 플랜을 선택하세요'}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                {t('subscription_description') || '더 많은 포인트와 고급 기능으로 AI 상담을 더욱 풍부하게 경험해보세요.'}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPurchase={handlePurchase}
                  loading={purchasePending}
                />
              ))}
            </div>

            {/* Footer Info */}
            <div className="mt-12 text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
                {t('subscription_terms') || '구독은 언제든지 취소할 수 있습니다.'}
              </p>
              <div className="flex justify-center space-x-6 text-xs text-gray-400">
                <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">
                  {t('terms_of_service') || '이용약관'}
                </a>
                <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">
                  {t('privacy_policy') || '개인정보처리방침'}
                </a>
                <a href="#" className="hover:text-gray-600 dark:hover:text-gray-300">
                  {t('refund_policy') || '환불정책'}
                </a>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PaymentSubscriptionScreen;
