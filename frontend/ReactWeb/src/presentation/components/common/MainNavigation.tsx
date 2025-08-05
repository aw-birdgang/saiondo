import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { useAuthStore } from '../../../stores/authStore';
import { Button } from './';

interface MainNavigationProps {
  className?: string;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const navigationItems = [
    { path: ROUTES.HOME, label: t('common.home'), icon: '🏠' },
    { path: ROUTES.CHANNELS, label: t('common.channels'), icon: '💬' },
    { path: ROUTES.CHAT, label: t('common.chat'), icon: '💭' },
    { path: ROUTES.ASSISTANT, label: t('common.assistant'), icon: '🤖' },
    { path: ROUTES.ANALYSIS, label: t('common.analysis'), icon: '📊' },
    { path: ROUTES.CALENDAR, label: t('common.calendar'), icon: '📅' },
    { path: ROUTES.MYPAGE, label: t('common.mypage'), icon: '👤' },
  ];

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    navigate(`${ROUTES.PROFILE}/${user?.id || 'me'}`);
  };

  return (
    <nav className={`bg-white shadow-sm border-b ${className}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* 로고 및 메인 네비게이션 */}
          <div className="flex items-center space-x-8">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-gray-900">
                {t('common.app_name', { defaultValue: 'Saiondo' })}
              </h1>
            </div>
            
            {/* 메인 네비게이션 링크들 */}
            <div className="hidden md:flex space-x-6">
              {navigationItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => navigate(item.path)}
                  className={`flex items-center space-x-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 사용자 메뉴 */}
          <div className="flex items-center space-x-4">
            {/* Profile 버튼 */}
            <Button
              variant="outline"
              size="sm"
              onClick={handleProfileClick}
              className="flex items-center space-x-1"
            >
              <span>👤</span>
              <span>{t('common.profile')}</span>
            </Button>

            {/* 사용자 아바타 */}
            {user && (
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                  {user.name?.charAt(0).toUpperCase() || 'U'}
                </div>
                <span className="text-sm text-gray-700 hidden sm:block">
                  {user.name}
                </span>
              </div>
            )}
          </div>
        </div>

        {/* 모바일 네비게이션 */}
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={`flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium transition-colors ${
                  isActive(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <span>{item.icon}</span>
                <span>{item.label}</span>
              </button>
            ))}
            
            {/* 모바일 Profile 버튼 */}
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 w-full px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <span>👤</span>
              <span>{t('common.profile')}</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation; 