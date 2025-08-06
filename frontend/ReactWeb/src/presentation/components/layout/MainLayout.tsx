import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, Link, useNavigate } from 'react-router-dom';
import { useRouteChange } from '@/presentation/hooks/useRouteChange';
import { ThemeToggle } from '@/presentation/components/common/ThemeToggle';
import { Button } from '@/presentation/components/common/Button';
import { cn } from '@/utils/cn';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { useMediaQuery } from '@/presentation/hooks/useMediaQuery';
import { SearchInput } from '@/presentation/components/search';

interface NavItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  description?: string;
  badge?: number;
}

export const MainLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  // const [searchQuery, setSearchQuery] = useState('');
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
    onRouteChange: () => {
      if (isMobile) {
        setSidebarOpen(false);
      }
    },
  });

  const navItems: NavItem[] = [
    {
      name: 'Dashboard',
      href: '/',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 5a2 2 0 012-2h4a2 2 0 012 2v6H8V5z'
          />
        </svg>
      ),
      description: '메인 대시보드',
    },
    {
      name: 'Chat',
      href: '/chat',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z'
          />
        </svg>
      ),
      description: '실시간 채팅',
      badge: 3,
    },
    {
      name: 'Channels',
      href: '/channels',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10'
          />
        </svg>
      ),
      description: '채널 관리',
    },
    {
      name: 'AI Assistant',
      href: '/assistant',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z'
          />
        </svg>
      ),
      description: 'AI 어시스턴트',
    },
    {
      name: 'Analytics',
      href: '/analysis',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z'
          />
        </svg>
      ),
      description: '데이터 분석',
    },
    {
      name: 'Calendar',
      href: '/calendar',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z'
          />
        </svg>
      ),
      description: '일정 관리',
    },
    {
      name: 'Settings',
      href: '/settings',
      icon: (
        <svg
          className='w-5 h-5'
          fill='none'
          stroke='currentColor'
          viewBox='0 0 24 24'
        >
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M15 12a3 3 0 11-6 0 3 3 0 016 0z'
          />
        </svg>
      ),
      description: '설정',
    },
  ];

  // 네비게이션 그룹
  const navGroups = [
    {
      label: 'Main',
      items: [
        navItems[0], // Dashboard
        navItems[1], // Chat
        navItems[2], // Channels
      ],
    },
    {
      label: 'Tools',
      items: [
        navItems[3], // AI Assistant
        navItems[4], // Analytics
        navItems[5], // Calendar
      ],
    },
    {
      label: 'System',
      items: [
        navItems[6], // Settings
      ],
    },
  ];

  // 모바일 하단 네비게이션 아이템
  const mobileNavItems = [
    { name: 'Dashboard', href: '/', icon: navItems[0].icon },
    {
      name: 'Chat',
      href: '/chat',
      icon: navItems[1].icon,
      badge: navItems[1].badge,
    },
    { name: 'Channels', href: '/channels', icon: navItems[2].icon },
    { name: 'AI', href: '/assistant', icon: navItems[3].icon },
    { name: 'Settings', href: '/settings', icon: navItems[6].icon },
  ];

  // 브레드크럼 생성
  const getBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(Boolean);
    const breadcrumbs = [{ name: 'Dashboard', href: '/' }];

    pathSegments.forEach((segment, index) => {
      const href = '/' + pathSegments.slice(0, index + 1).join('/');
      const name = segment.charAt(0).toUpperCase() + segment.slice(1);
      breadcrumbs.push({ name, href });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <div className='flex h-screen bg-gray-50 dark:bg-gray-900'>
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className={cn(
            'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0',
            sidebarOpen ? 'translate-x-0' : '-translate-x-full'
          )}
        >
          <div className='flex flex-col h-full bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700'>
            {/* Sidebar Header */}
            <div className='flex items-center justify-between h-16 px-6 border-b border-gray-200 dark:border-gray-700'>
              <div className='flex items-center space-x-3'>
                <div className='w-8 h-8 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg'>
                  <span className='text-white font-bold text-sm'>S</span>
                </div>
                <h1 className='text-xl font-bold text-gray-900 dark:text-white'>
                  Saiondo
                </h1>
              </div>
              <Button
                variant='ghost'
                size='sm'
                onClick={() => setSidebarOpen(false)}
                className='lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M6 18L18 6M6 6l12 12'
                  />
                </svg>
              </Button>
            </div>

            {/* Navigation Groups */}
            <nav className='flex-1 px-4 py-6 space-y-6 overflow-y-auto'>
              {navGroups.map((group) => (
                <div key={group.label}>
                  <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 mb-3 px-2 tracking-widest uppercase'>
                    {group.label}
                  </div>
                  <div className='space-y-1'>
                    {group.items.map(item => {
                      const isActive = location.pathname === item.href;
                      return (
                        <div key={item.href} className='relative group'>
                          <Link
                            to={item.href}
                            className={cn(
                              'flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200 relative overflow-hidden',
                              isActive
                                ? 'bg-gradient-to-r from-red-500 to-red-600 text-white shadow-lg'
                                : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            )}
                            title={item.description}
                          >
                            <span
                              className={cn(
                                'mr-3 transition-colors duration-200',
                                isActive
                                  ? 'text-white'
                                  : 'text-gray-500 dark:text-gray-400 group-hover:text-red-500 dark:group-hover:text-red-400'
                              )}
                            >
                              {item.icon}
                            </span>
                            <span className='flex-1'>{item.name}</span>
                            {item.badge && (
                              <span
                                className={cn(
                                  'inline-flex items-center justify-center px-2 py-1 text-xs font-bold rounded-full',
                                  isActive
                                    ? 'bg-white/20 text-white'
                                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                                )}
                              >
                                {item.badge}
                              </span>
                            )}
                            {isActive && (
                              <div className='absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-pulse pointer-events-none' />
                            )}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>

            {/* Sidebar Footer - 프로필/설정/로그아웃 */}
            <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
              <Menu as='div' className='relative inline-block w-full text-left'>
                <div>
                  <Menu.Button className='w-full flex items-center space-x-3 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors'>
                    <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                      <span className='text-white font-bold text-sm'>U</span>
                    </div>
                    <span className='flex-1 text-gray-700 dark:text-gray-300 font-medium'>
                      내 프로필
                    </span>
                    <svg
                      className='w-4 h-4 text-gray-500 dark:text-gray-400'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M19 9l-7 7-7-7'
                      />
                    </svg>
                  </Menu.Button>
                </div>
                <Transition
                  as={Fragment}
                  enter='transition ease-out duration-100'
                  enterFrom='transform opacity-0 scale-95'
                  enterTo='transform opacity-100 scale-100'
                  leave='transition ease-in duration-75'
                  leaveFrom='transform opacity-100 scale-100'
                  leaveTo='transform opacity-0 scale-95'
                >
                  <Menu.Items className='absolute left-0 bottom-12 w-56 origin-bottom-left bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg focus:outline-none z-50'>
                    <div className='py-1'>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm',
                              props.active && 'bg-gray-100 dark:bg-gray-700'
                            )}
                            onClick={() => navigate('/mypage')}
                          >
                            마이페이지
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm',
                              props.active && 'bg-gray-100 dark:bg-gray-700'
                            )}
                            onClick={() => navigate('/profile/me')}
                          >
                            프로필 보기
                          </button>
                        )}
                      </Menu.Item>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm',
                              props.active && 'bg-gray-100 dark:bg-gray-700'
                            )}
                            onClick={() => navigate('/settings')}
                          >
                            설정
                          </button>
                        )}
                      </Menu.Item>
                      <div className='border-t border-gray-200 dark:border-gray-700 my-1'></div>
                      <Menu.Item>
                        {(props: { active: boolean }) => (
                          <button
                            className={cn(
                              'w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400',
                              props.active && 'bg-red-50 dark:bg-red-900/20'
                            )}
                            onClick={() => {
                              /* 로그아웃 로직 */
                            }}
                          >
                            로그아웃
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
              <div className='text-xs text-gray-500 dark:text-gray-400 text-center mt-2'>
                © 2024 Saiondo
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main content */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Header */}
        <header className='bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 shadow-sm'>
          <div className='flex items-center justify-between h-16 px-4 lg:px-6'>
            <div className='flex items-center space-x-4'>
              {!isMobile && (
                <Button
                  variant='ghost'
                  size='sm'
                  onClick={() => setSidebarOpen(true)}
                  className='lg:hidden text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  <svg
                    className='w-5 h-5'
                    fill='none'
                    stroke='currentColor'
                    viewBox='0 0 24 24'
                  >
                    <path
                      strokeLinecap='round'
                      strokeLinejoin='round'
                      strokeWidth={2}
                      d='M4 6h16M4 12h16M4 18h16'
                    />
                  </svg>
                </Button>
              )}

              {/* Breadcrumbs */}
              <nav className='hidden md:flex items-center space-x-2'>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className='flex items-center'>
                    {index > 0 && (
                      <svg
                        className='w-4 h-4 text-gray-400 mx-2'
                        fill='none'
                        stroke='currentColor'
                        viewBox='0 0 24 24'
                      >
                        <path
                          strokeLinecap='round'
                          strokeLinejoin='round'
                          strokeWidth={2}
                          d='M9 5l7 7-7 7'
                        />
                      </svg>
                    )}
                    <Link
                      to={crumb.href}
                      className={cn(
                        'text-sm font-medium transition-colors',
                        index === breadcrumbs.length - 1
                          ? 'text-gray-900 dark:text-white'
                          : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                      )}
                    >
                      {crumb.name}
                    </Link>
                  </div>
                ))}
              </nav>
            </div>

            <div className='flex items-center space-x-3'>
              {/* Search */}
              <div className='hidden md:block w-64'>
                <SearchInput placeholder='Search...' className='w-full' />
              </div>

              {/* Notifications */}
              <Button
                variant='ghost'
                size='sm'
                className='relative text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
              >
                <svg
                  className='w-5 h-5'
                  fill='none'
                  stroke='currentColor'
                  viewBox='0 0 24 24'
                >
                  <path
                    strokeLinecap='round'
                    strokeLinejoin='round'
                    strokeWidth={2}
                    d='M15 17h5l-5 5v-5z'
                  />
                </svg>
                <span className='absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white dark:border-gray-800' />
              </Button>

              {/* Theme Toggle */}
              <ThemeToggle size='md' />

              {/* User Menu */}
              {!isMobile && (
                <Button
                  variant='ghost'
                  size='sm'
                  className='text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200'
                >
                  <div className='w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center'>
                    <span className='text-white font-medium text-sm'>U</span>
                  </div>
                </Button>
              )}
            </div>
          </div>
        </header>

        {/* Main content area */}
        <main className='flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 dark:bg-gray-900 pb-16 lg:pb-0'>
          <div className='container mx-auto px-2 lg:px-4 py-6 lg:py-8'>
            <Outlet />
          </div>
        </main>

        {/* Mobile Bottom Navigation */}
        {isMobile && (
          <div className='fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-center justify-around py-2'>
              {mobileNavItems.map(item => {
                const isActive = location.pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    to={item.href}
                    className={cn(
                      'flex flex-col items-center justify-center py-2 px-3 rounded-lg transition-all duration-200 min-w-0 flex-1 relative',
                      isActive
                        ? 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-900/20'
                        : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                    )}
                  >
                    <div
                      className={cn(
                        'w-6 h-6 mb-1 relative',
                        isActive
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-500 dark:text-gray-400'
                      )}
                    >
                      {item.icon}
                      {item.badge && (
                        <span className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center'>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span className='text-xs font-medium truncate'>
                      {item.name}
                    </span>
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
          className='fixed inset-0 z-40 bg-black/50 lg:hidden'
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default MainLayout;
