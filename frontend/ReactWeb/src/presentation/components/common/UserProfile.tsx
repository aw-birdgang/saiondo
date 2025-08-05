import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../../shared/constants/app';
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { Card, Button } from './';

interface UserProfileProps {
  showEditButton?: boolean;
  showMemberSince?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const UserProfile: React.FC<UserProfileProps> = ({
  showEditButton = false,
  showMemberSince = true,
  size = 'md',
  className = '',
}) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();

  const displayUser = currentUser || user;
  const userName = (displayUser as any)?.name || t('common.user');
  const userEmail = displayUser?.email || 'user@example.com';
  const userInitial = userName.charAt(0).toUpperCase();

  const sizeClasses = {
    sm: {
      avatar: 'w-8 h-8 text-sm',
      name: 'text-sm font-semibold',
      email: 'text-xs',
      since: 'text-xs',
    },
    md: {
      avatar: 'w-12 h-12 text-lg',
      name: 'text-base font-semibold',
      email: 'text-sm',
      since: 'text-xs',
    },
    lg: {
      avatar: 'w-16 h-16 text-xl',
      name: 'text-lg font-semibold',
      email: 'text-sm',
      since: 'text-sm',
    },
  };

  const currentSize = sizeClasses[size];

  return (
    <Card className={className}>
      <div className='flex items-center space-x-4'>
        <div
          className={`${currentSize.avatar} bg-gradient-to-br from-blue-500 to-pink-500 rounded-full flex items-center justify-center text-white font-bold`}
        >
          {userInitial}
        </div>
        <div className='flex-1'>
          <h3 className={`${currentSize.name} text-gray-900`}>{userName}</h3>
          <p className={`${currentSize.email} text-gray-600`}>{userEmail}</p>
          {showMemberSince && displayUser?.createdAt && (
            <p className={`${currentSize.since} text-gray-500`}>
              {t('member_since')}:{' '}
              {new Date(displayUser.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>
        {showEditButton && (
          <Button
            variant='primary'
            size='sm'
            onClick={() => navigate(ROUTES.PROFILE)}
          >
            {t('edit')}
          </Button>
        )}
        <Button
          variant='outline'
          size='sm'
          onClick={() =>
            navigate(`${ROUTES.PROFILE}/${displayUser?.id || 'me'}`)
          }
        >
          {t('common.view_profile')}
        </Button>
      </div>
    </Card>
  );
};

export default UserProfile;
