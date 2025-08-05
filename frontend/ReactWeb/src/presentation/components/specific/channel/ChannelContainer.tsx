import React from 'react';
import { cn } from '../../../../utils/cn';

interface ChannelContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ChannelContainer: React.FC<ChannelContainerProps> = ({
  children,
  className,
}) => {
  return <div className={cn('space-y-6', className)}>{children}</div>;
};

export default ChannelContainer;
