import React from 'react';

interface CardProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  className?: string;
  onClick?: () => void;
  hoverable?: boolean;
  padding?: 'sm' | 'md' | 'lg';
}

const Card: React.FC<CardProps> = ({
  children,
  title,
  subtitle,
  className = '',
  onClick,
  hoverable = false,
  padding = 'md',
}) => {
  const baseClasses = 'card';
  const hoverClasses = hoverable ? 'hover:shadow-lg transition-all duration-200 cursor-pointer hover:scale-[1.02]' : '';
  const clickableClasses = onClick ? 'cursor-pointer' : '';

  const paddingClasses = {
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const cardClasses = `${baseClasses} ${hoverClasses} ${clickableClasses} ${paddingClasses[padding]} ${className}`;

  return (
    <div className={cardClasses} onClick={onClick}>
      {(title || subtitle) && (
        <div className="mb-6">
          {title && (
            <h3 className="text-lg font-semibold text-text mb-2">
              {title}
            </h3>
          )}
          {subtitle && (
            <p className="text-sm text-text-secondary leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card; 