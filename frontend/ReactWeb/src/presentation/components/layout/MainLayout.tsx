import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { ROUTES } from '../../../shared/constants/app';
import { useAuth } from '../../../contexts/AuthContext';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import HomeTabComponent from '../../pages/home/HomeTabComponent';
import ChannelPage from '../../pages/channel/ChannelPage';
import CalendarPage from '../../pages/calendar/CalendarPage';
import MyPage from '../../pages/mypage/MyPage';

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
  const { logout } = useAuth();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();
  
  const [selectedTab, setSelectedTab] = useState(0);

  // 탭 정의
  const tabs: TabItem[] = [
    {
      id: 'home',
      label: t('home'),
      icon: '🏠',
      component: HomeTabComponent,
      route: ROUTES.HOME,
    },
    {
      id: 'channels',
      label: t('channels'),
      icon: '👥',
      component: ChannelPage,
      route: ROUTES.CHANNELS,
    },
    {
      id: 'calendar',
      label: t('calendar'),
      icon: '📅',
      component: CalendarPage,
      route: ROUTES.PROFILE, // 임시로 PROFILE 사용
    },
    {
      id: 'profile',
      label: t('profile'),
      icon: '👤',
      component: MyPage,
      route: ROUTES.PROFILE,
    },
  ];

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
    } catch {
      toast.error(t('logout_error'));
    }
  };

  const SelectedComponent = tabs[selectedTab].component;

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-surface shadow-sm border-b border-border sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-on-primary font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-semibold text-text">
                  {t('app.name')}
                </h1>
              </div>
              {user && (
                <div className="hidden sm:flex items-center space-x-2">
                  <div className="w-2 h-2 bg-primary rounded-full"></div>
                  <span className="text-sm text-text-secondary">
                    {t('welcome')}, {user.name}
                  </span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={handleLogout}
                className="btn btn-outline text-sm px-4 py-2"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <SelectedComponent />
        </div>
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-surface border-t border-border fixed bottom-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(index)}
                className={`flex flex-col items-center py-3 px-4 flex-1 transition-all duration-200 ${
                  selectedTab === index
                    ? 'text-primary'
                    : 'text-text-secondary hover:text-text'
                }`}
              >
                <span className="text-xl mb-1 transition-transform duration-200 hover:scale-110">
                  {tab.icon}
                </span>
                <span className="text-xs font-medium">{tab.label}</span>
                {selectedTab === index && (
                  <div className="w-1 h-1 bg-primary rounded-full mt-1"></div>
                )}
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout; 