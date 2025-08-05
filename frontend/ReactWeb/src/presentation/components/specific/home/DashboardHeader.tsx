import React from 'react';
import { cn } from '../../../../utils/cn';
import UserProfileSection from './UserProfileSection';
import ActionButtons from './ActionButtons';
import BackgroundPattern from './BackgroundPattern';

interface DashboardHeaderProps {
  className?: string;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({ className }) => {
  return (
    <div className={cn(
      "relative overflow-hidden rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg",
      className
    )}>
      <BackgroundPattern />
      
      <div className="relative p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-6 lg:space-y-0">
          {/* Left Section - User Profile */}
          <UserProfileSection />
          
          {/* Right Section - Action Buttons */}
          <ActionButtons />
        </div>
      </div>
    </div>
  );
};

export default DashboardHeader; 