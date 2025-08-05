import React from 'react';
import type { SubscriptionProduct } from '../../../domain/types';

interface ProductCardProps {
  product: SubscriptionProduct;
  isSelected: boolean;
  onSelect: (product: SubscriptionProduct) => void;
  onPurchase: (product: SubscriptionProduct) => void;
  purchasePending?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  isSelected,
  onSelect,
  onPurchase,
  purchasePending = false,
}) => {
  return (
    <div
      className={`relative p-6 border-2 rounded-lg cursor-pointer transition-all duration-200 ${
        isSelected
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
      }`}
      onClick={() => onSelect(product)}
    >
      {product.popular && (
        <div className='absolute -top-3 left-1/2 transform -translate-x-1/2'>
          <span className='bg-blue-500 text-white px-3 py-1 rounded-full text-xs font-semibold'>
            인기
          </span>
        </div>
      )}

      <div className='text-center mb-4'>
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          {product.title}
        </h3>
        <p className='text-gray-600 dark:text-gray-400 text-sm mb-4'>
          {product.description}
        </p>

        <div className='mb-4'>
          <div className='flex items-center justify-center gap-2'>
            <span className='text-3xl font-bold text-gray-900 dark:text-white'>
              {product.price}
            </span>
            {product.originalPrice && (
              <span className='text-lg text-gray-500 line-through'>
                {product.originalPrice}
              </span>
            )}
          </div>
          {product.discount && (
            <span className='text-sm text-green-600 dark:text-green-400 font-semibold'>
              {product.discount}
            </span>
          )}
        </div>
      </div>

      <div className='space-y-3 mb-6'>
        {product.features.map((feature, index) => (
          <div key={index} className='flex items-center gap-2'>
            <svg
              className='w-4 h-4 text-green-500 flex-shrink-0'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M5 13l4 4L19 7'
              />
            </svg>
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              {feature}
            </span>
          </div>
        ))}
      </div>

      <button
        onClick={e => {
          e.stopPropagation();
          onPurchase(product);
        }}
        disabled={purchasePending}
        className={`w-full py-2 px-4 rounded-lg font-semibold transition-colors ${
          isSelected
            ? 'bg-blue-500 text-white hover:bg-blue-600'
            : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
        } disabled:opacity-50 disabled:cursor-not-allowed`}
      >
        {purchasePending ? '처리 중...' : '선택'}
      </button>
    </div>
  );
};

export default ProductCard;
