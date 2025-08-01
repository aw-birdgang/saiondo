import React from 'react';
import { InfoCard } from './index';

interface ChannelStatItemProps {
  title: string;
  value: string | number;
  icon: string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const ChannelStatItem: React.FC<ChannelStatItemProps> = ({
  title,
  value,
  icon,
  description,
  variant = 'default',
  className = '',
}) => {
  return (
    <InfoCard
      title={title}
      value={value}
      icon={icon}
      description={description}
      variant={variant}
      className={className}
    />
  );
};

export default ChannelStatItem; 