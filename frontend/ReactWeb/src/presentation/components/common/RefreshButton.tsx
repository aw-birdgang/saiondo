import React from 'react';
import { useTranslation } from 'react-i18next';

interface RefreshButtonProps {
  onClick: () => void;
  className?: string;
}

const RefreshButton: React.FC<RefreshButtonProps> = ({
  onClick,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <button
      onClick={onClick}
      className={`p-2 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors ${className}`}
      title={t('refresh') || '새로고침'}
    >
      <svg
        className='w-6 h-6'
        fill='none'
        stroke='currentColor'
        viewBox='0 0 24 24'
      >
        <path
          strokeLinecap='round'
          strokeLinejoin='round'
          strokeWidth={2}
          d='M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15'
        />
      </svg>
    </button>
  );
};

export default RefreshButton;
