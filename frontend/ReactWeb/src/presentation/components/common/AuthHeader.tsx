import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

interface AuthHeaderProps {
  title: string;
  subtitle?: string;
  linkText?: string;
  linkTo?: string;
  className?: string;
}

const AuthHeader: React.FC<AuthHeaderProps> = ({
  title,
  subtitle,
  linkText,
  linkTo,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`text-center ${className}`}>
      <div className="mb-8">
        <div className="w-16 h-16 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
          <span className="text-2xl text-on-primary font-bold">S</span>
        </div>
        <h2 className="text-3xl font-bold text-text mb-4">
          {title}
        </h2>
        {subtitle && (
          <p className="text-text-secondary">
            {subtitle}
            {linkText && linkTo && (
              <>
                {' '}
                <Link
                  to={linkTo}
                  className="font-semibold text-primary hover:text-primary-container transition-colors duration-200"
                >
                  {linkText}
                </Link>
              </>
            )}
          </p>
        )}
      </div>
    </div>
  );
};

export default AuthHeader; 