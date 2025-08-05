import React from 'react';
import { useTranslation } from 'react-i18next';
import { KeywordTag } from '../common';

interface KeywordsSectionProps {
  keywords: string[];
  className?: string;
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({
  keywords,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className='flex items-center space-x-4'>
        <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
          <span className='text-xl'>🏷️</span>
        </div>
        <h3 className='text-xl font-semibold text-txt leading-tight'>
          {t('main_keywords') || '주요 키워드'}
        </h3>
      </div>

      <div className='flex flex-wrap gap-4'>
        {keywords.map((keyword, index) => (
          <KeywordTag
            key={index}
            keyword={keyword}
            variant='primary'
            size='md'
          />
        ))}
      </div>

      <p className='text-sm text-txt-secondary leading-relaxed'>
        {t('keywords_description') ||
          '관계에서 자주 나타나는 주요 키워드들입니다'}
      </p>
    </div>
  );
};

export default KeywordsSection;
