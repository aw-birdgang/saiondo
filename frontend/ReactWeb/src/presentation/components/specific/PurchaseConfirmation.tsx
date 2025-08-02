import React from 'react';
import type { SubscriptionProduct } from '../../../domain/types';

interface PurchaseConfirmationProps {
  product: SubscriptionProduct | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  isProcessing?: boolean;
}

const PurchaseConfirmation: React.FC<PurchaseConfirmationProps> = ({
  product,
  isOpen,
  onClose,
  onConfirm,
  isProcessing = false
}) => {
  if (!isOpen || !product) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            구독 확인
          </h2>
          
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {product.title}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-4">
              {product.description}
            </p>
            
            <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 dark:text-gray-300">가격:</span>
                <span className="text-xl font-bold text-gray-900 dark:text-white">
                  {product.price}
                </span>
              </div>
              {product.originalPrice && (
                <div className="flex justify-between items-center mt-2">
                  <span className="text-gray-500 text-sm">정가:</span>
                  <span className="text-gray-500 text-sm line-through">
                    {product.originalPrice}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3 mb-6">
            <h4 className="font-semibold text-gray-900 dark:text-white">포함 기능:</h4>
            {product.features.map((feature, index) => (
              <div key={index} className="flex items-center gap-2">
                <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
                <span className="text-sm text-gray-700 dark:text-gray-300">
                  {feature}
                </span>
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:opacity-50"
            >
              취소
            </button>
            <button
              onClick={onConfirm}
              disabled={isProcessing}
              className="flex-1 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
            >
              {isProcessing ? '처리 중...' : '구독하기'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PurchaseConfirmation; 