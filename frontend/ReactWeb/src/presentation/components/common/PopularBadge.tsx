import React from 'react';
import { useTranslation } from 'react-i18next';

interface PopularBadgeProps {
  className?: string;
}

const PopularBadge: React.FC<PopularBadgeProps> = ({ className = '' }) => {
  const { t } = useTranslation();

  return (
    <div
      className={`absolute -top-3 left-1/2 transform -translate-x-1/2 ${className}`}
    >
      <span className='bg-gradient-to-r from-pink-500 to-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold'>
        {t('most_popular') || '인기'}
      </span>
    </div>
  );
};

export default PopularBadge;
