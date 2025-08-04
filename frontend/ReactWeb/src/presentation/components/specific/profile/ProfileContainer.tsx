import React from 'react';
import { cn } from '../../../../utils/cn';
import type { ProfileContainerProps } from '../../../pages/profile/types/profileTypes';

const ProfileContainer: React.FC<ProfileContainerProps> = ({
  children,
  className
}) => {
  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {children}
    </div>
  );
};

export default ProfileContainer; 