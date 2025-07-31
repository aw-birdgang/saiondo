import React from 'react';
import { useTranslation } from 'react-i18next';
import Button from '../../common/Button';
import LoadingSpinner from '../../common/LoadingSpinner';

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
      className={`relative bg-white dark:bg-dark-secondary-container rounded-2xl shadow-lg border-2 transition-all duration-200 hover:shadow-xl ${
        product.popular 
          ? 'border-pink-500 dark:border-pink-400' 
          : 'border-gray-200 dark:border-dark-border'
      } ${className}`}
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
        <Button
          variant={product.popular ? 'primary' : 'primary'}
          fullWidth
          onClick={() => onPurchase(product)}
          disabled={loading}
          loading={loading}
          className={product.popular ? 'bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600' : ''}
        >
          {t('subscribe_now') || '지금 구독하기'}
        </Button>
      </div>
    </div>
  );
};

export default ProductCard; 