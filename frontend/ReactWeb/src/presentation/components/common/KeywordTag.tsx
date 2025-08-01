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
  const getVariantClasses = (variant: 'default' | 'primary' | 'success' | 'warning' | 'error') => {
    const variantClasses = {
      default: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200',
      primary: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      success: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
      warning: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
      error: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
    };
    return variantClasses[variant];
  };

  const getSizeClasses = (size: 'sm' | 'md' | 'lg') => {
    const sizeClasses = {
      sm: 'px-2 py-1 text-xs',
      md: 'px-3 py-1.5 text-sm',
      lg: 'px-4 py-2 text-base',
    };
    return sizeClasses[size];
  };

  return (
    <span
      className={`
        inline-flex items-center rounded-full font-medium
        ${getVariantClasses(variant)}
        ${getSizeClasses(size)}
        ${className}
      `}
    >
      {keyword}
      {removable && (
        <button
          onClick={onRemove}
          className="ml-2 hover:bg-black/10 rounded-full p-0.5 transition-colors"
          type="button"
        >
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}
    </span>
  );
};

export default KeywordTag; 