import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LoadingState } from '../../common';

interface ProfileRedirectProps {
  message?: string;
}

export const ProfileRedirect: React.FC<ProfileRedirectProps> = ({ 
  message 
}) => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  useEffect(() => {
    // 짧은 지연 후 마이페이지로 리다이렉트
    const timer = setTimeout(() => {
      navigate('/mypage', { replace: true });
    }, 1000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <LoadingState 
          message={message || t('redirecting_to_mypage') || '마이페이지로 이동합니다...'} 
        />
      </div>
    </div>
  );
};

export default ProfileRedirect; 