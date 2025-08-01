import React from 'react';

interface SectionHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  action?: React.ReactNode;
  centered?: boolean;
  className?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  description,
  action,
  centered = false,
  className = ''
}) => {
  return (
    <div className={`mb-8 ${centered ? 'text-center' : ''} ${className}`}>
      {/* Title */}
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className={`text-gray-600 dark:text-gray-400 ${centered ? 'max-w-2xl mx-auto' : ''}`}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className={`mt-4 ${centered ? 'flex justify-center' : ''}`}>
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionHeader; 