import React from 'react';
// import { useTranslation } from 'react-i18next';
import { Card, CardHeader, CardTitle, CardContent, Button } from '../common';
import type {
  SubscriptionProduct,
  PaymentMethod,
  Coupon,
} from '../../../domain/types/payment';

interface ConfirmationStepProps {
  selectedProduct: SubscriptionProduct;
  selectedPaymentMethod: PaymentMethod;
  appliedCoupon: Coupon | null;
  discountedPrice: number;
  onPrevious: () => void;
  onConfirm: () => void;
  isProcessing: boolean;
}

export const ConfirmationStep: React.FC<ConfirmationStepProps> = ({
  selectedProduct,
  selectedPaymentMethod,
  appliedCoupon,
  discountedPrice,
  onPrevious,
  onConfirm,
  isProcessing,
}) => {
  // const { t } = useTranslation();

  return (
    <div className='space-y-6'>
      <div className='text-center'>
        <h1 className='text-3xl font-bold text-txt mb-2'>결제 확인</h1>
        <p className='text-txt-secondary'>
          주문 정보를 확인하고 결제를 진행하세요
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>주문 정보</CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex justify-between items-center'>
            <span className='text-txt'>선택한 플랜</span>
            <span className='font-medium text-txt'>
              {selectedProduct.title}
            </span>
          </div>
          <div className='flex justify-between items-center'>
            <span className='text-txt'>결제 방법</span>
            <span className='font-medium text-txt'>
              {selectedPaymentMethod.name}
            </span>
          </div>
          {appliedCoupon && (
            <div className='flex justify-between items-center'>
              <span className='text-txt'>적용된 쿠폰</span>
              <span className='font-medium text-green-600'>
                {appliedCoupon.description}
              </span>
            </div>
          )}
          <div className='border-t pt-4'>
            <div className='flex justify-between items-center text-lg font-bold'>
              <span className='text-txt'>총 결제 금액</span>
              <span className='text-primary'>
                ₩{discountedPrice.toLocaleString()}
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className='flex justify-between'>
        <Button variant='outline' onClick={onPrevious}>
          이전
        </Button>
        <Button onClick={onConfirm} loading={isProcessing}>
          결제 진행
        </Button>
      </div>
    </div>
  );
};
