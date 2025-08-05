import React from 'react';
import { cn } from '../../../../utils/cn';
import UserProfileSection from './UserProfileSection';
import ActionButtons from './ActionButtons';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl backdrop-blur-sm",
      className
    )}>
      {/* Enhanced Background Pattern */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 via-indigo-400/10 to-purple-400/10 transform rotate-12 scale-150"></div>
        <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-0 w-48 h-48 bg-gradient-to-br from-purple-400/20 to-transparent rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-gradient-to-br from-indigo-400/15 to-transparent rounded-full blur-2xl"></div>
      </div>
      
      <div className="relative p-8 lg:p-10">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-8 lg:space-y-0">
          {/* Left Section - User Profile */}
          <div className="flex-1">
            <UserProfileSection />
          </div>
          
          {/* Right Section - Action Buttons */}
          <div className="flex-shrink-0">
            <ActionButtons />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 