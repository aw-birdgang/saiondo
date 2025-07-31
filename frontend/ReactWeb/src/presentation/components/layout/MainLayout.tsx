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
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <h1 className="text-xl font-semibold text-gray-900">
                {t('app.name')}
              </h1>
              {user && (
                <span className="text-sm text-gray-500">
                  {t('welcome')}, {user.name}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                {t('logout')}
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <SelectedComponent />
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white border-t fixed bottom-0 left-0 right-0">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex justify-around">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                onClick={() => handleTabChange(index)}
                className={`flex flex-col items-center py-2 px-4 flex-1 ${
                  selectedTab === index
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <span className="text-xl mb-1">{tab.icon}</span>
                <span className="text-xs">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout; 