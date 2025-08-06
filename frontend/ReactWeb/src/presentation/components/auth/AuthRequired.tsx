import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

interface AuthRequiredProps {
  loginRoute: string;
  className?: string;
}

const AuthRequired: React.FC<AuthRequiredProps> = ({
  loginRoute,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div
      className={`min-h-screen bg-bg flex items-center justify-center ${className}`}
    >
      <div className='text-center max-w-md mx-auto px-6'>
        <div className='text-6xl mb-6 animate-pulse'>🔐</div>
        <h2 className='text-2xl font-bold text-txt mb-6 leading-tight'>
          {t('auth.login_required') || '로그인이 필요합니다'}
        </h2>
        <button
          onClick={() => navigate(loginRoute)}
          className='btn btn-primary px-8 py-3 rounded-lg font-semibold transition-all duration-200 hover:scale-105'
        >
          {t('auth.login') || '로그인'}
        </button>
      </div>
    </div>
  );
};

export default AuthRequired;
