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
    <p className={`text-sm text-text-secondary mb-3 leading-relaxed ${className}`}>
      {description}
    </p>
  );
};

export default ChannelDescription; 