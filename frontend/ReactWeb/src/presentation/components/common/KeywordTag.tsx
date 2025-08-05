import React from 'react';

interface KeywordTagProps {
  keyword: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  removable?: boolean;
  onRemove?: () => void;
  className?: string;
}

const KeywordTag: React.FC<KeywordTagProps> = ({
  keyword,
  variant = 'default',
  size = 'md',
  removable = false,
  onRemove,
  className = '',
}) => {
  const getVariantClasses = (
    variant: 'default' | 'primary' | 'success' | 'warning' | 'error'
  ) => {
    const variantClasses = {
      default: 'bg-secondary text-txt-secondary border border-border',
      primary: 'bg-primary/10 text-primary border border-primary/20',
      success:
        'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 border border-green-200 dark:border-green-800',
      warning:
        'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 border border-yellow-200 dark:border-yellow-800',
      error:
        'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 border border-red-200 dark:border-red-800',
    };
    return variantClasses[variant];
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'px-3 py-1 text-xs',
      md: 'px-4 py-2 text-sm',
      lg: 'px-5 py-2.5 text-base',
    };
    return sizeClasses[size];
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium transition-all duration-200 hover:scale-105
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
    >
      {keyword}
      {removable && (
        <button
          onClick={onRemove}
          className='ml-2 hover:bg-black/10 rounded-full p-1 transition-colors duration-200'
          type='button'
        >
          <svg
            className='w-3 h-3'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth={2}
              d='M6 18L18 6M6 6l12 12'
            />
          </svg>
        </button>
      )}
    </span>
  );
};

export default KeywordTag;
