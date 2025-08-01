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
    <div className={`min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center ${className}`}>
      <div className="text-center max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="text-6xl mb-4 animate-pulse">
          {icon}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          {title}
        </h1>

        {/* Message */}
        <p className="text-gray-600 dark:text-gray-400 mb-6 text-sm leading-relaxed">
          {message}
        </p>

        {/* Action Button */}
        {action && (
          <button
            onClick={action.onClick}
            className={`
              px-6 py-2 rounded-lg font-medium transition-colors
              ${action.variant === 'secondary'
                ? 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700'
                : 'bg-blue-500 text-white hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700'
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