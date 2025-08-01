import React from 'react';

interface ChannelDescriptionProps {
  description: string;
  className?: string;
}

const ChannelDescription: React.FC<ChannelDescriptionProps> = ({
  description,
  className = '',
}) => {
  return (
    <p className={`text-sm text-gray-600 dark:text-gray-400 mb-2 ${className}`}>
      {description}
    </p>
  );
};

export default ChannelDescription; 