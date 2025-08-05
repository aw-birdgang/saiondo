import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightContent?: React.ReactNode;
  className?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({
  title,
  subtitle,
  showBackButton = false,
  onBackClick,
  rightContent,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      navigate(-1);
    }
  };

  return (
    <div className={`bg-surface shadow-sm border-b border-border ${className}`}>
      <div className='max-w-4xl mx-auto px-4 py-6'>
        <div className='flex items-center justify-between'>
          <div className='flex items-center space-x-4'>
            {showBackButton && (
              <button
                onClick={handleBackClick}
                className='p-2 hover:bg-secondary rounded-full transition-all duration-200 text-txt-secondary hover:text-txt'
                aria-label={t('go_back') || '뒤로 가기'}
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
                    d='M15 19l-7-7 7-7'
                  />
                </svg>
              </button>
            )}

            <div className='flex-1'>
              <h1 className='text-2xl font-bold text-txt'>{title}</h1>
              {subtitle && (
                <p className='text-sm text-txt-secondary mt-2 leading-relaxed'>
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {rightContent && (
            <div className='flex items-center space-x-3'>{rightContent}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PageHeader;
