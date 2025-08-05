import React from 'react';
import { InfoCard } from './index';

interface SystemStatItemProps {
  title: string;
  value: string;
  icon: string;
  description: string;
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info';
  className?: string;
}

const SystemStatItem: React.FC<SystemStatItemProps> = ({
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

export default SystemStatItem;
