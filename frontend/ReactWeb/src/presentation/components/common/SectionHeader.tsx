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
      <h2 className="text-3xl font-bold text-txt mb-4 leading-tight">
        {title}
      </h2>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg text-txt-secondary mb-3 font-medium">
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className={`text-txt-secondary leading-relaxed ${centered ? 'max-w-2xl mx-auto' : ''}`}>
          {description}
        </p>
      )}

      {/* Action */}
      {action && (
        <div className={`mt-6 ${centered ? 'flex justify-center' : ''}`}>
          {action}
        </div>
      )}
    </div>
  );
};

export default SectionHeader; 