import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/shared/constants/app';
import { useAuth } from '@/contexts/AuthContext';
import { useAuthStore } from '@/stores/authStore';
// import { useUserStore } from '@/stores/userStore';
import { ThemeToggle } from '@/presentation/components/common/ThemeToggle';

interface HeaderProps {
  title?: string;
  showBackButton?: boolean;
  backRoute?: string;
  showUserInfo?: boolean;
  showLogout?: boolean;
  showThemeToggle?: boolean;
  className?: string;
  children?: React.ReactNode;
}

const Header: React.FC<HeaderProps> = ({
  title,
  showBackButton = false,
  backRoute,
  showUserInfo = true,
  showLogout = false,
  showThemeToggle = true,
  className = '',
  children,
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { logout } = useAuth();
  const { user } = useAuthStore();
  // const { currentUser } = useUserStore();

  const handleLogout = async () => {
    try {
      console.log('🔄 Header: Logging out...');
      logout();
      // 로그아웃 후 리다이렉트는 authStore에서 처리됨
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const handleBack = () => {
    if (backRoute) {
      navigate(backRoute);
    } else {
      navigate(-1);
    }
  };

  return (
    <div
      className={`shadow-sm border-b transition-colors duration-300 ${className}`}
      style={{
        backgroundColor: 'var(--color-surface)',
        borderColor: 'var(--color-border)',
        boxShadow: '0 1px 3px 0 var(--color-shadow)',
      }}
    >
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center py-4'>
          <div className='flex items-center space-x-4'>
            {showBackButton && (
              <button
                onClick={handleBack}
                className='transition-colors duration-200'
                style={{ color: 'var(--color-txt-secondary)' }}
              >
                ← {t('common.back')}
              </button>
            )}
            {title && (
              <h1
                className='text-2xl font-bold'
                style={{ color: 'var(--color-txt)' }}
              >
                {title}
              </h1>
            )}
            {showUserInfo && user?.name && (
              <div className='flex items-center space-x-2'>
                <span
                  className='text-sm'
                  style={{ color: 'var(--color-txt-secondary)' }}
                >
                  {t('common.welcome')}, {user.name}
                </span>
                <button
                  onClick={() =>
                    navigate(`${ROUTES.PROFILE}/${user?.id || 'me'}`)
                  }
                  className='text-sm text-blue-600 hover:text-blue-800 underline'
                >
                  {t('common.view_profile')}
                </button>
              </div>
            )}
          </div>
          <div className='flex items-center space-x-4'>
            {children}
            {showThemeToggle && <ThemeToggle />}
            {showLogout && (
              <button
                onClick={handleLogout}
                className='px-4 py-2 rounded-md transition-colors duration-200'
                style={{
                  backgroundColor: 'var(--color-error)',
                  color: 'var(--color-on-error)',
                }}
              >
                {t('auth.signOut')}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
