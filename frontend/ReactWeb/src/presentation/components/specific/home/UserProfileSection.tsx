import React from 'react';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '../../../../stores/authStore';
import { cn } from '../../../../utils/cn';

interface UserProfileSectionProps {
  className?: string;
}

const UserProfileSection: React.FC<UserProfileSectionProps> = ({ className }) => {
  const { t } = useTranslation();
  const { user } = useAuthStore();

  return (
    <div className={cn("flex items-center space-x-4 lg:border-l lg:border-gray-200 dark:lg:border-gray-700 lg:pl-8", className)}>
      <div className="relative group">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-105">
          <span className="text-white font-bold text-xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        {/* Online Status Indicator */}
        <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-white dark:border-gray-800 rounded-full shadow-sm"></div>
      </div>
      <div className="space-y-1">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">
          {user?.name || t('common.user')}님
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          프로필 관리
        </p>
        <div className="flex items-center space-x-4 pt-1">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">온라인</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">활성</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection; 