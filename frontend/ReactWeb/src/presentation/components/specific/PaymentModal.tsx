import React, { useState, useEffect } from 'react';
import { usePayment } from '../../../infrastructure/payment/PaymentService';
import type {
  PaymentItem,
  PaymentRequest,
} from '../../../infrastructure/payment/PaymentService';
import { useAuthStore } from '../../../stores/authStore';
import { toast } from 'react-hot-toast';

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: PaymentItem[];
  onSuccess?: (paymentId: string) => void;
  onCancel?: () => void;
}

export const PaymentModal: React.FC<PaymentModalProps> = ({
  isOpen,
  onClose,
  items,
  onSuccess,
  onCancel,
}) => {
  const { user } = useAuthStore();
  const { createPayment, getPaymentStatus } = usePayment();

  const [isLoading, setIsLoading] = useState(false);
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentStatus, setPaymentStatus] = useState<string>('pending');
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>('card');

  // 총 금액 계산
  const totalAmount = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // 결제 요청 생성
  const handlePayment = async () => {
    if (!user?.id || !user.email) {
      toast.error('로그인이 필요합니다.');
      return;
    }

    setIsLoading(true);

    try {
      const paymentRequest: PaymentRequest = {
        orderId: `order-${Date.now()}`,
        amount: totalAmount,
        currency: 'KRW',
        items,
        customerEmail: user.email,
        customerName: user.name || user.email,
        successUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        metadata: {
          userId: user.id,
          paymentMethod: selectedPaymentMethod,
        },
      };

      const response = await createPayment(paymentRequest);

      if (response.success && response.paymentId) {
        setPaymentId(response.paymentId);

        // 결제 상태 폴링
        pollPaymentStatus(response.paymentId);

        toast.success('결제가 요청되었습니다.');
      } else {
        toast.error(response.error || '결제 요청에 실패했습니다.');
      }
    } catch (error) {
      console.error('Payment failed:', error);
      toast.error('결제 처리 중 오류가 발생했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 결제 상태 폴링
  const pollPaymentStatus = async (id: string) => {
    const maxAttempts = 30; // 최대 30번 시도 (5분)
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) {
        toast.error('결제 상태 확인 시간이 초과되었습니다.');
        return;
      }

      const status = await getPaymentStatus(id);

      if (status) {
        setPaymentStatus(status.status);

        if (status.status === 'completed') {
          toast.success('결제가 완료되었습니다!');
          onSuccess?.(id);
          onClose();
        } else if (status.status === 'failed') {
          toast.error('결제에 실패했습니다.');
          onCancel?.();
        } else if (status.status === 'cancelled') {
          toast('결제가 취소되었습니다.');
          onCancel?.();
        } else {
          // 계속 폴링
          attempts++;
          setTimeout(poll, 10000); // 10초마다 확인
        }
      } else {
        attempts++;
        setTimeout(poll, 10000);
      }
    };

    poll();
  };

  // 모달이 닫힐 때 상태 초기화
  useEffect(() => {
    if (!isOpen) {
      setPaymentId(null);
      setPaymentStatus('pending');
      setSelectedPaymentMethod('card');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50'>
      <div className='bg-white rounded-lg p-6 w-full max-w-md mx-4'>
        <div className='flex justify-between items-center mb-4'>
          <h2 className='text-xl font-semibold'>결제</h2>
          <button
            onClick={onClose}
            className='text-gray-500 hover:text-gray-700'
            disabled={isLoading}
          >
            ✕
          </button>
        </div>

        {/* 결제 상품 목록 */}
        <div className='mb-6'>
          <h3 className='font-medium mb-3'>주문 상품</h3>
          <div className='space-y-2'>
            {items.map(item => (
              <div key={item.id} className='flex justify-between items-center'>
                <div>
                  <p className='font-medium'>{item.name}</p>
                  {item.description && (
                    <p className='text-sm text-gray-600'>{item.description}</p>
                  )}
                </div>
                <div className='text-right'>
                  <p className='font-medium'>
                    {new Intl.NumberFormat('ko-KR', {
                      style: 'currency',
                      currency: 'KRW',
                    }).format(item.price * item.quantity)}
                  </p>
                  {item.quantity > 1 && (
                    <p className='text-sm text-gray-500'>
                      {item.quantity}개 ×{' '}
                      {new Intl.NumberFormat('ko-KR', {
                        style: 'currency',
                        currency: 'KRW',
                      }).format(item.price)}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 결제 방법 선택 */}
        <div className='mb-6'>
          <h3 className='font-medium mb-3'>결제 방법</h3>
          <div className='space-y-2'>
            <label className='flex items-center'>
              <input
                type='radio'
                value='card'
                checked={selectedPaymentMethod === 'card'}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
                className='mr-2'
                disabled={isLoading}
              />
              신용카드
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                value='bank'
                checked={selectedPaymentMethod === 'bank'}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
                className='mr-2'
                disabled={isLoading}
              />
              계좌이체
            </label>
            <label className='flex items-center'>
              <input
                type='radio'
                value='kakao'
                checked={selectedPaymentMethod === 'kakao'}
                onChange={e => setSelectedPaymentMethod(e.target.value)}
                className='mr-2'
                disabled={isLoading}
              />
              카카오페이
            </label>
          </div>
        </div>

        {/* 총 금액 */}
        <div className='border-t pt-4 mb-6'>
          <div className='flex justify-between items-center'>
            <span className='text-lg font-semibold'>총 결제 금액</span>
            <span className='text-xl font-bold text-blue-600'>
              {new Intl.NumberFormat('ko-KR', {
                style: 'currency',
                currency: 'KRW',
              }).format(totalAmount)}
            </span>
          </div>
        </div>

        {/* 결제 상태 표시 */}
        {paymentId && (
          <div className='mb-4 p-3 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-600'>
              결제 상태:
              <span
                className={`ml-2 font-medium ${
                  paymentStatus === 'completed'
                    ? 'text-green-600'
                    : paymentStatus === 'failed'
                      ? 'text-red-600'
                      : paymentStatus === 'cancelled'
                        ? 'text-gray-600'
                        : 'text-yellow-600'
                }`}
              >
                {paymentStatus === 'pending'
                  ? '처리 중...'
                  : paymentStatus === 'completed'
                    ? '완료'
                    : paymentStatus === 'failed'
                      ? '실패'
                      : paymentStatus === 'cancelled'
                        ? '취소됨'
                        : '알 수 없음'}
              </span>
            </p>
          </div>
        )}

        {/* 버튼 */}
        <div className='flex space-x-3'>
          <button
            onClick={onClose}
            className='flex-1 px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50'
            disabled={isLoading}
          >
            취소
          </button>
          <button
            onClick={handlePayment}
            disabled={isLoading || !user?.id}
            className='flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed'
          >
            {isLoading ? '처리 중...' : '결제하기'}
          </button>
        </div>

        {/* 사용자 정보 */}
        {user && (
          <div className='mt-4 p-3 bg-gray-50 rounded-lg'>
            <p className='text-sm text-gray-600'>
              결제자: {user.name || user.email}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
