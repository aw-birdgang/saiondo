import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Button,
  Input,
} from '../common';
import { cn } from '../../../utils/cn';
import type {
  PaymentMethod,
  CardDetails,
  Coupon,
} from '../../../domain/types/payment';

interface PaymentMethodStepProps {
  paymentMethods: PaymentMethod[];
  selectedPaymentMethod: string;
  cardDetails: CardDetails;
  couponCode: string;
  appliedCoupon: Coupon | null;
  onPaymentMethodSelect: (methodId: string) => void;
  onCardDetailsChange: (field: keyof CardDetails, value: string) => void;
  onCouponCodeChange: (code: string) => void;
  onApplyCoupon: () => void;
  onRemoveCoupon: () => void;
  onNext: () => void;
  onPrevious: () => void;
}

export const PaymentMethodStep: React.FC<PaymentMethodStepProps> = ({
  paymentMethods,
  selectedPaymentMethod,
  cardDetails,
  couponCode,
  appliedCoupon,
  onPaymentMethodSelect,
  onCardDetailsChange,
  onCouponCodeChange,
  onApplyCoupon,
  onRemoveCoupon,
  onNext,
  onPrevious,
}) => {
  const { t } = useTranslation();

  const handleNext = () => {
    if (selectedPaymentMethod === 'card') {
      if (
        !cardDetails.number ||
        !cardDetails.expiry ||
        !cardDetails.cvv ||
        !cardDetails.name
      ) {
        return; // 에러 처리는 상위 컴포넌트에서
      }
    }
    onNext();
  };

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-txt mb-2'>결제 방법 선택</h1>
        <p className='text-txt-secondary'>
          안전하고 편리한 결제 방법을 선택하세요
        </p>
      </div>

      {/* 결제 방법 선택 */}
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        {paymentMethods.map(method => (
          <Card
            key={method.id}
            className={cn(
              'cursor-pointer transition-all duration-200',
              selectedPaymentMethod === method.id &&
                'ring-2 ring-primary bg-primary/5',
              !method.isAvailable && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() =>
              method.isAvailable && onPaymentMethodSelect(method.id)
            }
          >
            <CardContent className='p-4'>
              <div className='flex items-center space-x-3'>
                <div className='text-2xl'>{method.icon}</div>
                <div className='flex-1'>
                  <div className='font-medium text-txt'>{method.name}</div>
                  <div className='text-sm text-txt-secondary'>
                    {method.description}
                  </div>
                </div>
                {selectedPaymentMethod === method.id && (
                  <div className='w-5 h-5 bg-primary rounded-full flex items-center justify-center'>
                    <svg
                      className='w-3 h-3 text-white'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path
                        fillRule='evenodd'
                        d='M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z'
                        clipRule='evenodd'
                      />
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
          <CardContent className='space-y-4'>
            <div>
              <label className='block text-sm font-medium text-txt mb-1'>
                카드 번호
              </label>
              <Input
                type='text'
                placeholder='1234 5678 9012 3456'
                value={cardDetails.number}
                onChange={e => onCardDetailsChange('number', e.target.value)}
                maxLength={19}
              />
            </div>
            <div className='grid grid-cols-2 gap-4'>
              <div>
                <label className='block text-sm font-medium text-txt mb-1'>
                  만료일
                </label>
                <Input
                  type='text'
                  placeholder='MM/YY'
                  value={cardDetails.expiry}
                  onChange={e => onCardDetailsChange('expiry', e.target.value)}
                  maxLength={5}
                />
              </div>
              <div>
                <label className='block text-sm font-medium text-txt mb-1'>
                  CVV
                </label>
                <Input
                  type='text'
                  placeholder='123'
                  value={cardDetails.cvv}
                  onChange={e => onCardDetailsChange('cvv', e.target.value)}
                  maxLength={4}
                />
              </div>
            </div>
            <div>
              <label className='block text-sm font-medium text-txt mb-1'>
                카드 소유자명
              </label>
              <Input
                type='text'
                placeholder='홍길동'
                value={cardDetails.name}
                onChange={e => onCardDetailsChange('name', e.target.value)}
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
          <div className='flex space-x-2'>
            <Input
              placeholder='쿠폰 코드를 입력하세요'
              value={couponCode}
              onChange={e => onCouponCodeChange(e.target.value)}
              className='flex-1'
            />
            <Button onClick={onApplyCoupon}>적용</Button>
          </div>
          {appliedCoupon && (
            <div className='mt-2 p-2 bg-green-50 border border-green-200 rounded flex justify-between items-center'>
              <div className='text-sm text-green-800'>
                {appliedCoupon.description} 적용됨
              </div>
              <Button
                variant='outline'
                size='sm'
                onClick={onRemoveCoupon}
                className='text-green-600 border-green-300 hover:bg-green-50'
              >
                제거
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 네비게이션 버튼 */}
      <div className='flex justify-between'>
        <Button variant='outline' onClick={onPrevious}>
          이전
        </Button>
        <Button onClick={handleNext}>다음</Button>
      </div>
    </div>
  );
};
