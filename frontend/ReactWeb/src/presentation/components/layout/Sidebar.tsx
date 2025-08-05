import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../../shared/constants/app';

interface MenuItem {
  id: string;
  label: string;
  icon: string;
  route: string;
  badge?: number;
  isActive?: boolean;
}

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const Sidebar: React.FC<SidebarProps> = ({
  isOpen,
  onClose,
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems: MenuItem[] = [
    {
      id: 'home',
      label: t('home') || '홈',
      icon: '🏠',
      route: ROUTES.HOME,
      isActive: location.pathname === ROUTES.HOME,
    },
    {
      id: 'chat',
      label: t('chat') || '채팅',
      icon: '💬',
      route: ROUTES.CHAT,
      isActive: location.pathname.startsWith('/chat'),
    },
    {
      id: 'assistant',
      label: t('assistant') || 'AI 상담사',
      icon: '🤖',
      route: ROUTES.ASSISTANT,
      isActive: location.pathname === ROUTES.ASSISTANT,
    },
    {
      id: 'analysis',
      label: t('analysis') || '관계 분석',
      icon: '📊',
      route: ROUTES.ANALYSIS,
      isActive: location.pathname.startsWith('/analysis'),
    },
    {
      id: 'calendar',
      label: t('calendar') || '캘린더',
      icon: '📅',
      route: ROUTES.CALENDAR,
      isActive: location.pathname === ROUTES.CALENDAR,
    },
    {
      id: 'channels',
      label: t('channels') || '채널',
      icon: '👥',
      route: ROUTES.CHANNELS,
      isActive: location.pathname.startsWith('/channels'),
    },
    {
      id: 'payment',
      label: t('payment') || '결제',
      icon: '💳',
      route: ROUTES.PAYMENT,
      isActive: location.pathname === ROUTES.PAYMENT,
    },
    {
      id: 'mypage',
      label: t('mypage') || '마이페이지',
      icon: '👤',
      route: ROUTES.MYPAGE,
      isActive: location.pathname === ROUTES.MYPAGE,
    },
  ];

  const handleMenuItemClick = (route: string) => {
    navigate(route);
    if (window.innerWidth < 768) {
      onClose();
    }
  };

  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className='fixed inset-0 bg-overlay z-40 md:hidden'
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full bg-surface border-r border-border z-50
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          ${collapsed ? 'w-16' : 'w-64'}
          md:translate-x-0 md:static
          ${className}
        `}
      >
        {/* Header */}
        <div className='flex items-center justify-between p-4 border-b border-divider'>
          {!collapsed && (
            <div className='flex items-center space-x-3'>
              <div className='w-8 h-8 bg-primary rounded-lg flex items-center justify-center'>
                <span className='text-on-primary font-bold text-sm'>S</span>
              </div>
              <h1 className='text-xl font-bold text-txt'>
                {t('app.name') || 'Saiondo'}
              </h1>
            </div>
          )}
          <button
            onClick={() => setCollapsed(!collapsed)}
            className='p-2 rounded-lg hover:bg-secondary text-txt-secondary transition-colors duration-200'
          >
            <span className='text-sm font-medium'>{collapsed ? '→' : '←'}</span>
          </button>
        </div>

        {/* Menu Items */}
        <nav className='p-4 space-y-2'>
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleMenuItemClick(item.route)}
              className={`
                w-full flex items-center gap-3 px-3 py-3 rounded-lg
                transition-all duration-200 text-left group
                ${
                  item.isActive
                    ? 'bg-primary/10 text-primary border-l-4 border-primary'
                    : 'text-txt-secondary hover:bg-secondary hover:text-txt'
                }
              `}
            >
              <span
                className={`text-lg flex-shrink-0 transition-transform duration-200 group-hover:scale-110 ${
                  item.isActive ? 'text-primary' : 'text-txt-secondary'
                }`}
              >
                {item.icon}
              </span>
              {!collapsed && (
                <>
                  <span className='flex-1 font-medium'>{item.label}</span>
                  {item.badge && (
                    <span className='bg-error text-on-error text-xs rounded-full px-2 py-1 min-w-[20px] text-center font-medium'>
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          ))}
        </nav>

        {/* Footer */}
        {!collapsed && (
          <div className='absolute bottom-0 left-0 right-0 p-4 border-t border-divider bg-secondary'>
            <div className='text-xs text-txt-secondary text-center'>
              © 2024 Saiondo
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Sidebar;
