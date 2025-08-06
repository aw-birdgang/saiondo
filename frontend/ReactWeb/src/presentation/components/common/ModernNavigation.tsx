import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/app';
import { useAuthStore } from '@/stores/authStore';
import { Button, Avatar, Badge, GlassmorphicCard, NeumorphicCard } from './';
import { useTheme } from '@/shared/design-system/hooks';
import { useIntersectionAnimation } from '@/shared/design-system/animations';

interface ModernNavigationProps {
  className?: string;
}

const ModernNavigation: React.FC<ModernNavigationProps> = ({ className = '' }) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();
  const { theme, toggleTheme } = useTheme();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Animation hooks
  const { elementRef: navRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');

  const navigationItems = [
    { path: ROUTES.HOME, label: t('common.home'), icon: '🏠', modernPath: '/modern' },
    { path: ROUTES.CHANNELS, label: t('common.channels'), icon: '💬', modernPath: '/modern-channels' },
    { path: ROUTES.CHAT, label: t('common.chat'), icon: '💭', modernPath: '/modern-chat' },
    { path: ROUTES.ASSISTANT, label: t('common.assistant'), icon: '🤖' },
    { path: ROUTES.ANALYSIS, label: t('common.analysis'), icon: '📊', modernPath: '/modern-analysis' },
    { path: ROUTES.CALENDAR, label: t('common.calendar'), icon: '📅' },
    { path: ROUTES.MYPAGE, label: t('common.mypage'), icon: '👤', modernPath: '/modern-profile' },
  ];

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  const handleProfileClick = () => {
    navigate(`${ROUTES.PROFILE}/${user?.id || 'me'}`);
  };

  const handleNavigationClick = (item: any) => {
    // Modern version이 있으면 modern version으로, 없으면 기존으로
    const targetPath = item.modernPath || item.path;
    navigate(targetPath);
    setIsMobileMenuOpen(false);
  };

  return (
    <>
      {/* Desktop Navigation */}
      <nav 
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? 'bg-white/90 dark:bg-gray-900/90 backdrop-blur-md shadow-lg' 
            : 'bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm'
        } ${className}`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <div className="flex items-center space-x-8">
              <div className="flex-shrink-0">
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  {t('common.app_name', { defaultValue: 'Saiondo' })}
                </h1>
              </div>

              {/* Desktop Navigation Items */}
              <div className="hidden lg:flex space-x-2">
                {navigationItems.map(item => (
                  <div key={item.path} className="relative group">
                    <button
                      onClick={() => handleNavigationClick(item)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive(item.path)
                          ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
                          : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                      }`}
                    >
                      <span className="text-lg">{item.icon}</span>
                      <span>{item.label}</span>
                      {item.modernPath && (
                        <Badge variant="success" size="sm" className="ml-1">
                          NEW
                        </Badge>
                      )}
                    </button>
                    
                    {/* Hover effect */}
                    {!isActive(item.path) && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Theme toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleTheme}
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? '🌞' : '🌙'}
              </Button>

              {/* Notifications */}
              <Button
                variant="ghost"
                size="sm"
                className="rounded-full p-2 hover:bg-gray-100 dark:hover:bg-gray-800 relative"
              >
                <span className="text-lg">🔔</span>
                <Badge variant="destructive" size="sm" className="absolute -top-1 -right-1">
                  3
                </Badge>
              </Button>

              {/* User profile */}
              {user && (
                <div className="flex items-center space-x-3">
                  <div
                    className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold cursor-pointer hover:scale-110 transition-all ring-2 ring-primary/20 hover:ring-primary/40"
                    onClick={handleProfileClick}
                  >
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                  <div className="hidden sm:block">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {user.name}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      {user.email}
                    </div>
                  </div>
                </div>
              )}

              {/* Mobile menu button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="lg:hidden rounded-full p-2"
              >
                <span className="text-lg">☰</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-white/95 dark:bg-gray-900/95 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
            <div className="px-4 py-4 space-y-2">
              {navigationItems.map(item => (
                <button
                  key={item.path}
                  onClick={() => handleNavigationClick(item)}
                  className={`flex items-center justify-between w-full px-4 py-3 rounded-xl text-left transition-all duration-200 ${
                    isActive(item.path)
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.modernPath && (
                    <Badge variant="success" size="sm">
                      NEW
                    </Badge>
                  )}
                </button>
              ))}
              
              {/* Mobile profile button */}
              <button
                onClick={handleProfileClick}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl text-left text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <span className="text-lg">👤</span>
                  <span className="font-medium">{t('common.profile')}</span>
                </div>
              </button>
            </div>
          </div>
        )}
      </nav>

      {/* Spacer for fixed navigation */}
      <div className="h-16" />

      {/* Floating Quick Actions */}
      <div className="fixed bottom-6 right-6 z-40 space-y-3">
        <GlassmorphicCard className="p-3 cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl">💬</div>
        </GlassmorphicCard>
        
        <GlassmorphicCard className="p-3 cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl">📊</div>
        </GlassmorphicCard>
        
        <GlassmorphicCard className="p-3 cursor-pointer hover:scale-110 transition-transform">
          <div className="text-2xl">⚡</div>
        </GlassmorphicCard>
      </div>
    </>
  );
};

export default ModernNavigation; 