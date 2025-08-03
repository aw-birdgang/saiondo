import React, { useState, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from "../../../stores/authStore";
import { useDataLoader } from '../../hooks/useDataLoader';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  StatusBadge,
  LoadingSpinner,
  Modal,
  ModalFooter,
  Input,
  ProgressBar
} from '../../components/common';
import { useToastContext } from '../../providers/ToastProvider';
import { cn } from '../../../utils/cn';
import type { SubscriptionProduct, PaymentMethod } from '../../../domain/types';

type PaymentStep = 'product' | 'payment' | 'confirmation' | 'processing' | 'complete';

const PaymentPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const toast = useToastContext();

  const [currentStep, setCurrentStep] = useState<PaymentStep>('product');
  const [selectedProduct, setSelectedProduct] = useState<SubscriptionProduct | null>(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>('card');
  const [couponCode, setCouponCode] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentProgress, setPaymentProgress] = useState(0);
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvv: '',
    name: ''
  });

  // Use custom hook for data loading
  const { data: products = [], loading: isLoading, error } = useDataLoader(
    async () => {
      await new Promise(resolve => setTimeout(resolve, 1000));

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
          popular: false,
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
          popular: false,
        },
      ];

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

  // 결제 단계별 진행률
  const getStepProgress = () => {
    switch (currentStep) {
      case 'product': return 25;
      case 'payment': return 50;
      case 'confirmation': return 75;
      case 'processing': return 90;
      case 'complete': return 100;
      default: return 0;
    }
  };

  // 할인된 가격 계산
  const getDiscountedPrice = () => {
    if (!selectedProduct) return 0;
    
    const price = parseInt(selectedProduct.price.replace(/[^\d]/g, ''));
    const discount = appliedCoupon ? appliedCoupon.discountPercent : 0;
    
    return price * (1 - discount / 100);
  };

  // 쿠폰 적용
  const handleApplyCoupon = useCallback(() => {
    if (!couponCode.trim()) {
      toast.error('쿠폰 코드를 입력해주세요.');
      return;
    }

    // 시뮬레이션: 쿠폰 검증
    if (couponCode === 'WELCOME10') {
      setAppliedCoupon({
        code: couponCode,
        discountPercent: 10,
        description: '신규 가입 10% 할인'
      });
      toast.success('쿠폰이 적용되었습니다!');
    } else {
      toast.error('유효하지 않은 쿠폰 코드입니다.');
    }
  }, [couponCode, toast]);

  const handleProductSelect = (product: SubscriptionProduct) => {
    setSelectedProduct(product);
    setCurrentStep('payment');
  };

  const handlePaymentMethodSelect = (methodId: string) => {
    setSelectedPaymentMethod(methodId);
  };

  const handlePaymentSubmit = () => {
    if (selectedPaymentMethod === 'card') {
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvv || !cardDetails.name) {
        toast.error('카드 정보를 모두 입력해주세요.');
        return;
      }
    }
    setCurrentStep('confirmation');
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    setCurrentStep('processing');

    try {
      // 결제 진행 시뮬레이션
      for (let i = 0; i <= 100; i += 10) {
        setPaymentProgress(i);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('구독이 성공적으로 완료되었습니다!');
      setCurrentStep('complete');
      
      setTimeout(() => {
        navigate(ROUTES.HOME);
      }, 2000);
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('결제에 실패했습니다. 다시 시도해주세요.');
      setCurrentStep('payment');
    } finally {
      setIsProcessing(false);
    }
  };

  const renderProductSelection = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-txt mb-2">구독 플랜 선택</h1>
        <p className="text-txt-secondary">원하는 플랜을 선택하고 결제를 진행하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products?.map((product) => (
          <Card 
            key={product.id} 
            className={cn(
              'cursor-pointer transition-all duration-200 hover:shadow-lg',
              product.popular && 'ring-2 ring-primary'
            )}
            onClick={() => handleProductSelect(product)}
          >
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-xl">{product.title}</CardTitle>
                {product.popular && (
                  <Badge variant="default">인기</Badge>
                )}
              </div>
              <p className="text-txt-secondary">{product.description}</p>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-4">
                <div className="text-3xl font-bold text-txt">{product.price}</div>
                {product.originalPrice && (
                  <div className="text-txt-secondary line-through">{product.originalPrice}</div>
                )}
                {product.discount && (
                  <Badge variant="success" className="mt-2">{product.discount}</Badge>
                )}
              </div>
              
              <ul className="space-y-2 mb-4">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-center space-x-2">
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                    <span className="text-sm text-txt">{feature}</span>
                  </li>
                ))}
              </ul>
              
              <Button variant="primary" fullWidth>
                선택하기
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );

  const renderPaymentMethod = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-txt mb-2">결제 방법 선택</h1>
        <p className="text-txt-secondary">안전하고 편리한 결제 방법을 선택하세요</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {paymentMethods.map((method) => (
          <Card 
            key={method.id}
            className={cn(
              'cursor-pointer transition-all duration-200',
              selectedPaymentMethod === method.id && 'ring-2 ring-primary bg-primary/5',
              !method.isAvailable && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => method.isAvailable && handlePaymentMethodSelect(method.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-center space-x-3">
                <div className="text-2xl">{method.icon}</div>
                <div className="flex-1">
                  <div className="font-medium text-txt">{method.name}</div>
                  <div className="text-sm text-txt-secondary">{method.description}</div>
                </div>
                {selectedPaymentMethod === method.id && (
                  <div className="w-5 h-5 bg-primary rounded-full flex items-center justify-center">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 카드 정보 입력 */}
      {selectedPaymentMethod === 'card' && (
        <Card>
          <CardHeader>
            <CardTitle>카드 정보</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-txt mb-1">카드 번호</label>
              <Input
                type="text"
                placeholder="1234 5678 9012 3456"
                value={cardDetails.number}
                onChange={(e) => setCardDetails(prev => ({ ...prev, number: e.target.value }))}
                maxLength={19}
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-txt mb-1">만료일</label>
                <Input
                  type="text"
                  placeholder="MM/YY"
                  value={cardDetails.expiry}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, expiry: e.target.value }))}
                  maxLength={5}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-txt mb-1">CVV</label>
                <Input
                  type="text"
                  placeholder="123"
                  value={cardDetails.cvv}
                  onChange={(e) => setCardDetails(prev => ({ ...prev, cvv: e.target.value }))}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-txt mb-1">카드 소유자명</label>
              <Input
                type="text"
                placeholder="홍길동"
                value={cardDetails.name}
                onChange={(e) => setCardDetails(prev => ({ ...prev, name: e.target.value }))}
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* 쿠폰 입력 */}
      <Card>
        <CardHeader>
          <CardTitle>할인 쿠폰</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              placeholder="쿠폰 코드를 입력하세요"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleApplyCoupon}>적용</Button>
          </div>
          {appliedCoupon && (
            <div className="mt-2 p-2 bg-green-50 border border-green-200 rounded">
              <div className="text-sm text-green-800">
                {appliedCoupon.description} 적용됨
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('product')}>
          이전
        </Button>
        <Button onClick={handlePaymentSubmit}>
          다음
        </Button>
      </div>
    </div>
  );

  const renderConfirmation = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-txt mb-2">결제 확인</h1>
        <p className="text-txt-secondary">주문 정보를 확인하고 결제를 진행하세요</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 정보</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-txt">선택한 플랜</span>
            <span className="font-medium text-txt">{selectedProduct?.title}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-txt">결제 방법</span>
            <span className="font-medium text-txt">
              {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
            </span>
          </div>
          {appliedCoupon && (
            <div className="flex justify-between items-center">
              <span className="text-txt">적용된 쿠폰</span>
              <span className="font-medium text-green-600">{appliedCoupon.description}</span>
            </div>
          )}
          <div className="border-t pt-4">
            <div className="flex justify-between items-center text-lg font-bold">
              <span className="text-txt">총 결제 금액</span>
              <span className="text-primary">₩{getDiscountedPrice().toLocaleString()}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={() => setCurrentStep('payment')}>
          이전
        </Button>
        <Button onClick={handlePurchase} loading={isProcessing}>
          결제 진행
        </Button>
      </div>
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto">
        <LoadingSpinner size="lg" />
      </div>
      <div>
        <h1 className="text-2xl font-bold text-txt mb-2">결제 처리 중</h1>
        <p className="text-txt-secondary">잠시만 기다려주세요...</p>
      </div>
      <ProgressBar progress={paymentProgress} showPercentage />
    </div>
  );

  const renderComplete = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
        </svg>
      </div>
      <div>
        <h1 className="text-2xl font-bold text-txt mb-2">결제 완료!</h1>
        <p className="text-txt-secondary">구독이 성공적으로 활성화되었습니다.</p>
      </div>
      <Button onClick={() => navigate(ROUTES.HOME)}>
        홈으로 이동
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" text="구독 상품을 불러오는 중..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-txt mb-2">상품 로딩 오류</h2>
          <p className="text-txt-secondary mb-4">{error}</p>
          <Button onClick={() => window.location.reload()}>
            다시 시도
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg">
      {/* 진행률 표시 */}
      <div className="bg-surface border-b border-border p-4">
        <div className="max-w-4xl mx-auto">
          <ProgressBar progress={getStepProgress()} showPercentage={false} />
          <div className="flex justify-between mt-2 text-sm text-txt-secondary">
            <span>플랜 선택</span>
            <span>결제 정보</span>
            <span>확인</span>
            <span>완료</span>
          </div>
        </div>
      </div>

      {/* 메인 콘텐츠 */}
      <div className="max-w-4xl mx-auto p-6">
        {currentStep === 'product' && renderProductSelection()}
        {currentStep === 'payment' && renderPaymentMethod()}
        {currentStep === 'confirmation' && renderConfirmation()}
        {currentStep === 'processing' && renderProcessing()}
        {currentStep === 'complete' && renderComplete()}
      </div>
    </div>
  );
};

export default PaymentPage;
