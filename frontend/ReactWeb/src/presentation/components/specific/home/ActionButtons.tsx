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
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
        {/* Profile Actions */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-2 sm:space-y-0 sm:space-x-2">
          <TouchFriendlyButton
            variant="outline"
            size="lg"
            onClick={handleMyPageClick}
            leftIcon={<UserProfileIcon />}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all duration-200"
          >
            마이페이지
          </TouchFriendlyButton>
          <TouchFriendlyButton
            variant="outline"
            size="lg"
            onClick={handleProfileClick}
            leftIcon={<ProfileViewIcon />}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 hover:border-blue-400 dark:hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400 hover:shadow-lg transition-all duration-200"
          >
            프로필 보기
          </TouchFriendlyButton>
        </div>

        {/* Settings Action */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center">
          <TouchFriendlyButton
            variant="ghost"
            size="lg"
            onClick={handleSettingsClick}
            leftIcon={<SettingsIcon />}
            className="bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-lg transition-all duration-200"
          >
            설정
          </TouchFriendlyButton>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons; 