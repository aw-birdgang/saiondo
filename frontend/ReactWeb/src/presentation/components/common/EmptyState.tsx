import React from 'react';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}

const EmptyState: React.FC<EmptyStateProps> = ({
  icon,
  title,
  description,
  action,
  className = '',
}) => {
  return (
    <div className={`text-center py-16 ${className}`}>
      {icon && (
        <div className="mx-auto h-16 w-16 text-txt-secondary mb-6">
          {icon}
        </div>
      )}
      <h3 className="text-xl font-semibold text-txt mb-3">
        {title}
      </h3>
      {description && (
        <p className="text-txt-secondary mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>
      )}
      {action && (
        <div className="flex justify-center">
          {action}
        </div>
      )}
    </div>
  );
};

export default EmptyState; 