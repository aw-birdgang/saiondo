import React from 'react';
import { useTranslation } from 'react-i18next';

interface User {
  name: string;
  profileUrl?: string;
  mbti?: string;
}

interface MbtiMatchProps {
  user1: User;
  user2: User;
  matchPercent?: string;
  className?: string;
}

const MbtiMatch: React.FC<MbtiMatchProps> = ({
  user1,
  user2,
  matchPercent,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`space-y-6 ${className}`}>
      <div className='flex items-center space-x-4'>
        <div className='w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center'>
          <span className='text-xl'>🧠</span>
        </div>
        <h3 className='text-xl font-semibold text-txt leading-tight'>
          {t('couple_mbti_match') || 'MBTI 호환성'}
        </h3>
      </div>

      <div className='flex items-center justify-center space-x-8'>
        <div className='text-center'>
          <div className='px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold text-lg mb-3 shadow-sm'>
            {user1.mbti || 'N/A'}
          </div>
          <p className='text-sm text-txt-secondary font-medium'>{user1.name}</p>
        </div>

        <div className='flex flex-col items-center'>
          <span className='text-3xl mb-3 animate-pulse'>💕</span>
          {matchPercent && (
            <div className='text-center'>
              <div className='text-2xl font-bold text-primary'>
                {matchPercent}%
              </div>
              <div className='text-sm text-txt-secondary font-medium'>
                {t('good_match') || '좋은 조합'}
              </div>
            </div>
          )}
        </div>

        <div className='text-center'>
          <div className='px-6 py-3 bg-primary/10 text-primary rounded-full font-semibold text-lg mb-3 shadow-sm'>
            {user2.mbti || 'N/A'}
          </div>
          <p className='text-sm text-txt-secondary font-medium'>{user2.name}</p>
        </div>
      </div>

      <div className='text-center'>
        <p className='text-sm text-txt-secondary leading-relaxed'>
          {t('mbti_description') || 'MBTI 성향을 기반으로 한 호환성 분석입니다'}
        </p>
      </div>
    </div>
  );
};

export default MbtiMatch;
