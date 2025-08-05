import React from 'react';

interface PriceDisplayProps {
  price: string;
  originalPrice?: string;
  discount?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({
  price,
  originalPrice,
  discount,
  size = 'md',
  className = '',
}) => {
  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'text-lg',
      md: 'text-2xl',
      lg: 'text-3xl',
    };
    return sizeClasses[size];
  };

  return (
    <div className={`${className}`}>
      <div className='flex items-baseline space-x-2'>
        <span
          className={`font-bold text-gray-900 dark:text-white ${getSizeClasses(size)}`}
        >
          {price}
        </span>
        {originalPrice && (
          <span className='text-lg text-gray-500 line-through'>
            {originalPrice}
          </span>
        )}
      </div>
      {discount && (
        <span className='text-sm text-green-600 dark:text-green-400 font-medium'>
          {discount}
        </span>
      )}
    </div>
  );
};

export default PriceDisplay;
