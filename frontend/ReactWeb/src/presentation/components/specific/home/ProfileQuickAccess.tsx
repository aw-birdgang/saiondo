import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, Button } from '../../common';
import { useAuthStore } from '../../../../stores/authStore';

interface ProfileQuickAccessProps {
  className?: string;
}

const ProfileQuickAccess: React.FC<ProfileQuickAccessProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();

  const handleProfileClick = () => {
    navigate('/profile/me');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  return (
    <Card className={`bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200 ${className}`}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                {user?.name || t('common.user')}님, 안녕하세요!
              </h3>
              <p className="text-sm text-gray-600">
                프로필을 확인하고 관리해보세요
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleMyPageClick}
              className="text-blue-600 border-blue-300 hover:bg-blue-50"
            >
              마이페이지
            </Button>
            <Button
              variant="primary"
              size="sm"
              onClick={handleProfileClick}
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
            >
              프로필 보기
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileQuickAccess; 