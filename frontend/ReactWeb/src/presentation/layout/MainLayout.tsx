import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../core/stores/authStore';
import { useUserStore } from '../../core/stores/userStore';
import HomeTab from '../home/HomeTab';
import ChannelTab from '../channel/ChannelTab';
import CalendarTab from '../calendar/CalendarTab';
import MyPageTab from '../mypage/MyPageTab';

interface TabItem {
  id: string;
  label: string;
  icon: string;
  component: React.ComponentType;
  route: string;
}

const MainLayout: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, unreadPushCount, clearUnreadPush } = useAuthStore();
  const { initUser } = useUserStore();
  
  const [selectedTab, setSelectedTab] = useState(0);

  // 탭 정의
  const tabs: TabItem[] = [
    {
      id: 'home',
      label: t('home'),
      icon: '🏠',
      component: HomeTab,
      route: ROUTES.HOME,
    },
    {
      id: 'channel',
      label: t('channel'),
      icon: '👥',
      component: ChannelTab,
      route: ROUTES.CHANNEL,
    },
    {
      id: 'calendar',
      label: t('schedule'),
      icon: '📅',
      component: CalendarTab,
      route: ROUTES.CALENDAR,
    },
    {
      id: 'mypage',
      label: t('my'),
      icon: '👤',
      component: MyPageTab,
      route: ROUTES.MYPAGE,
    },
  ];

  // 사용자 초기화
  useEffect(() => {
    initUser();
  }, [initUser]);

  // URL에 따른 탭 선택
  useEffect(() => {
    const currentPath = location.pathname;
    const tabIndex = tabs.findIndex(tab => tab.route === currentPath);
    if (tabIndex !== -1) {
      setSelectedTab(tabIndex);
    }
  }, [location.pathname]);

  const handleTabChange = (index: number) => {
    setSelectedTab(index);
    navigate(tabs[index].route);
  };

  const handleLogout = async () => {
    try {
      await logout();
      toast.success(t('logout_success'));
      navigate(ROUTES.LOGIN);
    } catch (error) {
      toast.error(t('logout_error'));
    }
  };

  const handleNotificationClick = () => {
    clearUnreadPush();
    navigate(ROUTES.NOTIFICATIONS);
  };

  const handleInvitePartner = () => {
    navigate(ROUTES.INVITE_PARTNER);
  };

  const handleChannelInvitations = () => {
    navigate(ROUTES.CHANNEL_INVITATIONS);
  };

  const currentTab = tabs[selectedTab];
  const CurrentComponent = currentTab.component;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <header className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Title */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {currentTab.label}
              </h1>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                onClick={handleNotificationClick}
                className="relative p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5zM10.5 3.75a6 6 0 00-6 6v3.75l-2.25 2.25V19.5h12.75V15.75L15.75 13.5V9.75a6 6 0 00-6-6z" />
                </svg>
                {unreadPushCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadPushCount}
                  </span>
                )}
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="p-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                title={t('logout')}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Channel Tab Actions */}
      {selectedTab === 1 && (
        <div className="bg-white dark:bg-dark-secondary-container border-b dark:border-dark-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleInvitePartner}
                className="flex items-center justify-center px-4 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
                {t('invite_partner')}
              </button>
              
              <button
                onClick={handleChannelInvitations}
                className="flex items-center justify-center px-4 py-3 bg-pink-500 text-white rounded-lg hover:bg-pink-600 transition-colors"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                {t('received_invitations')}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1">
        <CurrentComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white dark:bg-dark-secondary-container border-t dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-4 gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(index)}
                className={`flex flex-col items-center py-3 px-2 transition-colors ${
                  selectedTab === index
                    ? 'text-pink-600 dark:text-pink-400'
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <span className="text-2xl mb-1">{tab.icon}</span>
                <span className="text-xs font-medium">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout; 