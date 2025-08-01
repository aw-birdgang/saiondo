import React from 'react';

interface StatusIndicatorProps {
  status: 'online' | 'offline' | 'away' | 'busy' | 'active' | 'inactive';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  className?: string;
}

const StatusIndicator: React.FC<StatusIndicatorProps> = ({
  status,
  size = 'md',
  showLabel = false,
  className = ''
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'online':
      case 'active':
        return {
          color: 'bg-green-500',
          label: '온라인'
        };
      case 'offline':
      case 'inactive':
        return {
          color: 'bg-gray-400',
          label: '오프라인'
        };
      case 'away':
        return {
          color: 'bg-yellow-500',
          label: '자리비움'
        };
      case 'busy':
        return {
          color: 'bg-red-500',
          label: '바쁨'
        };
      default:
        return {
          color: 'bg-gray-400',
          label: '알 수 없음'
        };
    }
  };

  const getSizeClasses = () => {
    switch (size) {
      case 'xs':
        return 'w-2 h-2';
      case 'sm':
        return 'w-3 h-3';
      case 'lg':
        return 'w-4 h-4';
      default:
        return 'w-2.5 h-2.5';
    }
  };

  const config = getStatusConfig();
  const sizeClasses = getSizeClasses();

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <div
        className={`
          ${sizeClasses} ${config.color} rounded-full
        `}
      />
      {showLabel && (
        <span className="text-xs text-gray-600 dark:text-gray-400">
          {config.label}
        </span>
      )}
    </div>
  );
};

export default StatusIndicator; 