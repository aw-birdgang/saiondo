import React from 'react';
import { useTranslation } from 'react-i18next';

interface SubscriptionFooterProps {
  className?: string;
}

const SubscriptionFooter: React.FC<SubscriptionFooterProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mt-12 text-center ${className}`}>
      <p className='text-sm text-gray-500 dark:text-gray-400 mb-4'>
        {t('subscription_terms') || '구독은 언제든지 취소할 수 있습니다.'}
      </p>
      <div className='flex justify-center space-x-6 text-xs text-gray-400'>
        <a href='#' className='hover:text-gray-600 dark:hover:text-gray-300'>
          {t('terms_of_service') || '이용약관'}
        </a>
        <a href='#' className='hover:text-gray-600 dark:hover:text-gray-300'>
          {t('privacy_policy') || '개인정보처리방침'}
        </a>
        <a href='#' className='hover:text-gray-600 dark:hover:text-gray-300'>
          {t('refund_policy') || '환불정책'}
        </a>
      </div>
    </div>
  );
};

export default SubscriptionFooter;
