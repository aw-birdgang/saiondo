import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from "../../../shared/constants/app";
import LoadingSpinner from '../../components/common/LoadingSpinner';
import EmptyState from '../../components/common/EmptyState';

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
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center space-x-3">
            <button
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-surface rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </button>
            <div className="flex items-center space-x-2">
              <span className="text-2xl">💎</span>
              <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                {t('subscription_plans') || '구독 플랜'}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <LoadingSpinner size="lg" />
          </div>
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
                <div
                  key={product.id}
                  className={`relative bg-white dark:bg-dark-secondary-container rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
                    product.popular 
                      ? 'border-pink-500 dark:border-pink-400' 
                      : 'border-gray-200 dark:border-dark-border'
                  }`}
                >
                  {/* Popular Badge */}
                  {product.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                        {t('most_popular') || '인기'}
                      </span>
                    </div>
                  )}

                  <div className="p-6">
                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {product.title}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                      {product.description}
                    </p>

                    {/* Price */}
                    <div className="mb-6">
                      <div className="flex items-baseline space-x-2">
                        <span className="text-3xl font-bold text-gray-900 dark:text-white">
                          {product.price}
                        </span>
                        {product.originalPrice && (
                          <span className="text-lg text-gray-500 line-through">
                            {product.originalPrice}
                          </span>
                        )}
                      </div>
                      {product.discount && (
                        <span className="text-sm text-green-600 dark:text-green-400 font-medium">
                          {product.discount}
                        </span>
                      )}
                    </div>

                    {/* Features */}
                    <ul className="space-y-3 mb-6">
                      {product.features.map((feature, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span className="text-gray-700 dark:text-gray-300 text-sm">
                            {feature}
                          </span>
                        </li>
                      ))}
                    </ul>

                    {/* Purchase Button */}
                    <button
                      onClick={() => handlePurchase(product)}
                      disabled={purchasePending}
                      className={`w-full py-3 px-6 rounded-xl font-semibold transition-all duration-200 ${
                        product.popular
                          ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white hover:from-pink-600 hover:to-purple-600'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      } disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                      {purchasePending ? (
                        <div className="flex items-center justify-center">
                          <LoadingSpinner size="sm" color="white" className="mr-2" />
                          {t('processing') || '처리 중...'}
                        </div>
                      ) : (
                        t('subscribe_now') || '지금 구독하기'
                      )}
                    </button>
                  </div>
                </div>
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
