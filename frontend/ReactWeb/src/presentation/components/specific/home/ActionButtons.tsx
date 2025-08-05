import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TouchFriendlyButton } from '../../common';
import { UserProfileIcon, ProfileViewIcon, SettingsIcon } from './IconComponents';

interface ActionButtonsProps {
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleProfileClick = () => {
    navigate('/profile/me');
  };

  const handleMyPageClick = () => {
    navigate('/mypage');
  };

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className={className}>
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-4 sm:space-y-0 sm:space-x-4">
        {/* Profile Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
          <TouchFriendlyButton
            variant="outline"
            size="lg"
            onClick={handleMyPageClick}
            leftIcon={<UserProfileIcon />}
            className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-400/70 dark:hover:border-blue-500/70 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-semibold"
          >
            <span className="relative z-10">마이페이지</span>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-50/50 to-indigo-50/50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </TouchFriendlyButton>
          <TouchFriendlyButton
            variant="outline"
            size="lg"
            onClick={handleProfileClick}
            leftIcon={<ProfileViewIcon />}
            className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border border-gray-300/50 dark:border-gray-600/50 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-purple-400/70 dark:hover:border-purple-500/70 hover:text-purple-600 dark:hover:text-purple-400 hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-semibold"
          >
            <span className="relative z-10">프로필 보기</span>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-50/50 to-pink-50/50 dark:from-purple-900/20 dark:to-pink-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </TouchFriendlyButton>
        </div>

        {/* Settings Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
          <TouchFriendlyButton
            variant="ghost"
            size="lg"
            onClick={handleSettingsClick}
            leftIcon={<SettingsIcon />}
            className="group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-semibold"
          >
            <span className="relative z-10">설정</span>
            {/* Hover effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </TouchFriendlyButton>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons; 