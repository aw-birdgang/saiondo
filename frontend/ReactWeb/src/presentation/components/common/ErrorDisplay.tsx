import React from 'react';
import { useTranslation } from 'react-i18next';

interface ErrorDisplayProps {
  icon?: string;
  title: string;
  message: string;
  action?: {
    label: string;
    onClick: () => void;
    variant?: 'primary' | 'secondary';
  };
  className?: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  icon = '❌',
  title,
  message,
  action,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <div className={`min-h-screen bg-background flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="text-6xl mb-6 animate-pulse">
          {icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-text mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-text-secondary mb-8 text-sm leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`
              btn px-6 py-3 rounded-lg font-medium transition-all duration-200
              ${action.variant === 'secondary'
                ? 'btn-secondary'
                : 'btn-primary'
              }
            `}
          >
            {action.label}
          </button>
        )}
      </div>
    </div>
  );
};

export default ErrorDisplay; 