import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button, PriceDisplay, FeatureList, PopularBadge } from '../../common';

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

interface ProductCardProps {
  product: SubscriptionProduct;
  onPurchase: (product: SubscriptionProduct) => void;
  loading?: boolean;
  className?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onPurchase,
  loading = false,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div
      className={`relative bg-white dark:bg-gray-800 rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
        product.popular
          ? 'border-pink-500 dark:border-pink-400'
          : 'border-gray-200 dark:border-gray-600'
      } ${className}`}
    >
      {/* Popular Badge */}
      {product.popular && <PopularBadge />}

      <div className='p-6'>
        {/* Title */}
        <h3 className='text-xl font-bold text-gray-900 dark:text-white mb-2'>
          {product.title}
        </h3>

        {/* Description */}
        <p className='text-gray-600 dark:text-gray-400 mb-4'>
          {product.description}
        </p>

        {/* Price */}
        <div className='mb-6'>
          <PriceDisplay
            price={product.price}
            originalPrice={product.originalPrice}
            discount={product.discount}
            size='lg'
          />
        </div>

        {/* Features */}
        <FeatureList features={product.features} className='mb-6' />

        {/* Purchase Button */}
        <Button
          variant='primary'
          fullWidth
          onClick={() => onPurchase(product)}
          disabled={loading}
          loading={loading}
          className={
            product.popular
              ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600'
              : ''
          }
        >
          {t('subscribe_now') || '지금 구독하기'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard;
