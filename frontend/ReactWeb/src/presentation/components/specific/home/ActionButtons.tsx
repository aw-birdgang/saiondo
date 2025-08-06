import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TouchFriendlyButton } from '@/presentation/components/common';
import {
  SettingsIcon,
} from '@/presentation/components/specific/home/IconComponents';

interface ActionButtonsProps {
  className?: string;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ className }) => {
  const navigate = useNavigate();

  const handleSettingsClick = () => {
    navigate('/settings');
  };

  return (
    <div className={className}>
      <div className='flex flex-col sm:flex-row items-stretch sm:items-center'>
        {/* Settings Action */}
        <div className='flex flex-col sm:flex-row items-stretch sm:items-center'>
          <TouchFriendlyButton
            variant='ghost'
            size='lg'
            onClick={handleSettingsClick}
            leftIcon={<SettingsIcon />}
            className='group relative bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm text-gray-600 dark:text-gray-400 hover:bg-white dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white hover:shadow-xl hover:scale-105 hover:-translate-y-1 transition-all duration-500 font-semibold'
          >
            <span className='relative z-10'>설정</span>
            {/* Hover effect */}
            <div className='absolute inset-0 bg-gradient-to-r from-gray-50/50 to-slate-50/50 dark:from-gray-900/20 dark:to-slate-900/20 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300'></div>
          </TouchFriendlyButton>
        </div>
      </div>
    </div>
  );
};

export default ActionButtons;
