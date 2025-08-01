import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

interface BreadcrumbItem {
  label: string;
  path?: string;
  icon?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  className = ''
}) => {
  const { t } = useTranslation();

  return (
    <nav className={`flex items-center space-x-2 text-sm ${className}`}>
      {items.map((item, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <span className="text-gray-400 dark:text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              {item.icon && <span>{item.icon}</span>}
              <span>{t(item.label) || item.label}</span>
            </Link>
          ) : (
            <span className={`flex items-center space-x-1 ${
              index === items.length - 1
                ? 'text-gray-900 dark:text-white font-medium'
                : 'text-gray-600 dark:text-gray-400'
            }`}>
              {item.icon && <span>{item.icon}</span>}
              <span>{t(item.label) || item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 