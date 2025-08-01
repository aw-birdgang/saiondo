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
    <div className={className}>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
        {title}
      </h2>
      {subtitle && (
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400">
          {subtitle}
          {linkText && linkTo && (
            <>
              {' '}
              <Link
                to={linkTo}
                className="font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300"
              >
                {linkText}
              </Link>
            </>
          )}
        </p>
      )}
    </div>
  );
};

export default AuthHeader; 