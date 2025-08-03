import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useRouteChange } from '../../hooks/useRouteChange';
import { ThemeToggle } from '../common/ThemeToggle';
import { Button } from '../common/Button';
import { cn } from '../../../utils/cn';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useMediaQuery } from '../../hooks/useMediaQuery';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
}

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const isTablet = useMediaQuery('(max-width: 1024px)');

  // Handle mobile detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Use custom hook for route change handling
  useRouteChange({
    onRouteChange: (pathname) => {
      if (isMobile) {
        setSidebarOpen(false);
      }
    }
  });

  const navItems: NavItem[] = [
    { 
      name: 'Home', 
      href: '/', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
        </svg>
      ),
      description: '메인 대시보드'
    },
    { 
      name: 'Chat', 
      href: '/chat', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      description: '실시간 채팅'
    },
    { 
      name: 'Channels', 
      href: '/channels', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
        </svg>
      ),
      description: '채널 관리'
    },
    { 
      name: 'Assistant', 
      href: '/assistant', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
        </svg>
      ),
      description: 'AI 어시스턴트'
    },
    { 
      name: 'Analysis', 
      href: '/analysis', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      description: '데이터 분석'
    },
    { 
      name: 'Calendar', 
      href: '/calendar', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      ),
      description: '일정 관리'
    },
    { 
      name: 'My Page', 
      href: '/mypage', 
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
      ),
      description: '내 정보 관리'
    },
  ];

  // 네비게이션 그룹 예시
  const navGroups = [
    {
      label: '메인',
      items: [
        navItems[0], // Home
        navItems[1], // Chat
        navItems[2], // Channels
      ],
    },
    {
      label: 'AI/분석',
      items: [
        navItems[3], // Assistant
        navItems[4], // Analysis
        navItems[5], // Calendar
      ],
    },
    {
      label: '내 정보',
      items: [
        navItems[6], // My Page
      ],
    },
  ];

  // 모바일 하단 네비게이션 아이템
  const mobileNavItems = [
    { name: '홈', href: '/', icon: navItems[0].icon },
    { name: '채팅', href: '/chat', icon: navItems[1].icon },
    { name: '채널', href: '/channels', icon: navItems[2].icon },
    { name: 'AI', href: '/assistant', icon: navItems[3].icon },
    { name: '내정보', href: '/mypage', icon: navItems[6].icon },
  ];

  return (
    <div className="flex h-screen bg-bg">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div 
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="flex flex-col h-full">
            {/* Sidebar Header */}
            <div className="flex items-center justify-between h-16 px-6 border-b border-border">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <span className="text-on-primary font-bold text-sm">S</span>
                </div>
                <h1 className="text-xl font-bold text-txt">Saiondo</h1>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setSidebarOpen(false)}
                className="lg:hidden"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </Button>
            </div>

            {/* Navigation Groups */}
            <nav className="flex-1 px-4 py-6 space-y-6 overflow-y-auto">
              {navGroups.map((group, gi) => (
                <div key={group.label}>
                  <div className="text-xs font-bold text-txt-secondary mb-2 px-2 tracking-widest uppercase">
                    {group.label}
                  </div>
                  <div className="space-y-1">
                    {group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      return (
                        <div key={item.href} className="relative group">
                          <Link
                            to={item.href}
                            className={cn(
                              'flex items-center px-3 py-3 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                              isActive 
                                ? 'bg-primary text-on-primary shadow-lg ring-2 ring-primary' 
                                : 'text-txt hover:bg-focus hover:text-primary'
                            )}
                            title={item.description}
                          >
                            <span className={cn(
                              'mr-3 transition-colors duration-200',
                              isActive ? 'text-on-primary' : 'text-txt-secondary group-hover:text-primary'
                            )}>
                              {item.icon}
                            </span>
                            <span className="flex-1">{item.name}</span>
                            {isActive && (
                              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none" />
                            )}
                          </Link>
                          {/* 툴팁 */}
                          <span className="absolute left-full top-1/2 -translate-y-1/2 ml-2 hidden group-hover:block bg-txt text-on-primary text-xs rounded px-2 py-1 shadow-lg z-10">
                            {item.description}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer - 프로필/설정/로그아웃 */}
            <div className="p-4 border-t border-border">
              <Menu as="div" className="relative inline-block w-full text-left">
                <div>
                  <Menu.Button className="w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-focus transition-colors">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                      <span className="text-on-primary font-bold text-sm">U</span>
                    </div>
                    <span className="flex-1 text-txt font-medium">내 프로필</span>
                    <svg className="w-4 h-4 text-txt-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </Menu.Button>
                </div>
                <Transition as={Fragment} enter="transition ease-out duration-100" enterFrom="transform opacity-0 scale-95" enterTo="transform opacity-100 scale-100" leave="transition ease-in duration-75" leaveFrom="transform opacity-100 scale-100" leaveTo="transform opacity-0 scale-95">
                  <Menu.Items className="absolute left-0 bottom-12 w-56 origin-bottom-left bg-surface border border-border rounded-lg shadow-lg focus:outline-none z-50">
                    <div className="py-1">
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn('w-full text-left px-4 py-2 text-sm', props.active && 'bg-focus')}
                            onClick={() => navigate('/mypage')}
                          >
                            마이페이지
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn('w-full text-left px-4 py-2 text-sm', props.active && 'bg-focus')}
                            onClick={() => navigate('/settings')}
                          >
                            설정
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn('w-full text-left px-4 py-2 text-sm text-error', props.active && 'bg-error/10')}
                            onClick={() => {/* 로그아웃 로직 */}}
                          >
                            로그아웃
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className="text-xs text-txt-secondary text-center mt-2">
                © 2024 Saiondo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-surface border-b border-border shadow-sm">
          <div className="flex items-center justify-between h-16 px-4 lg:px-6">
            <div className="flex items-center space-x-4">
              {!isMobile && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSidebarOpen(true)}
                  className="lg:hidden"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                </Button>
              )}
              <div className="hidden md:block">
                <h2 className="text-lg font-semibold text-txt">
                  {navItems.find(item => item.href === location.pathname)?.name || 'Dashboard'}
                </h2>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notifications */}
              <Button variant="ghost" size="sm" className="relative">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-5 5v-5z" />
                </svg>
                <span className="absolute -top-1 -right-1 w-3 h-3 bg-error rounded-full" />
              </Button>
              
              {/* Theme Toggle */}
              <ThemeToggle size="md" />
              
              {/* User Menu */}
              {!isMobile && (
                <Button variant="ghost" size="sm">
                  <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                    <span className="text-on-primary font-medium text-sm">U</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-bg pb-16 lg:pb-0">
          <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
            <div className="flex items-center justify-around py-2">
              {mobileNavItems.map((item) => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1',
                      isActive 
                        ? 'text-primary bg-primary/10' 
                        : 'text-txt-secondary hover:text-primary hover:bg-focus'
                    )}
                  >
                    <div className={cn(
                      'w-6 h-6 mb-1',
                      isActive ? 'text-primary' : 'text-txt-secondary'
                    )}>
                      {item.icon}
                    </div>
                    <span className="text-xs font-medium truncate">{item.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && isTablet && (
        <div 
          className="fixed inset-0 z-40 bg-overlay lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout; 