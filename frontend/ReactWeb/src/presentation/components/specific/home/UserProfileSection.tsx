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
    <div className={cn("flex items-center space-x-6 lg:space-x-8", className)}>
      <div className="relative group">
        <div className="relative w-20 h-20 lg:w-24 lg:h-24 bg-gradient-to-br from-blue-500 via-indigo-500 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl group-hover:shadow-3xl transition-all duration-500 group-hover:scale-110 group-hover:rotate-3">
          <span className="text-white font-bold text-2xl lg:text-3xl">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </span>
          {/* Avatar glow effect */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent rounded-3xl blur-sm"></div>
        </div>
        {/* Enhanced Online Status Indicator */}
        <div className="absolute -bottom-2 -right-2 w-6 h-6 lg:w-7 lg:h-7 bg-gradient-to-br from-emerald-400 to-emerald-600 border-3 border-white dark:border-gray-800 rounded-full shadow-lg animate-pulse">
          <div className="absolute inset-1 bg-emerald-300 rounded-full animate-ping"></div>
        </div>
      </div>
      <div className="space-y-2 lg:space-y-3">
        <h3 className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white leading-tight">
          {user?.name || t('common.user')}님
        </h3>
        <p className="text-sm lg:text-base text-gray-600 dark:text-gray-400 font-medium">
          프로필 관리
        </p>
        <div className="flex items-center space-x-6 pt-2">
          <div className="flex items-center space-x-2">
            <div className="relative">
              <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-3 h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">온라인</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full shadow-sm"></div>
            <span className="text-xs lg:text-sm text-gray-500 dark:text-gray-400 font-semibold uppercase tracking-wider">활성</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfileSection; 