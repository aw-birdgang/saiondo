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
            <span className="text-txt-secondary">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          )}
          
          {item.path && index < items.length - 1 ? (
            <Link
              to={item.path}
              className="flex items-center space-x-1 text-txt-secondary hover:text-primary transition-colors duration-200 px-2 py-1 rounded-md hover:bg-secondary"
            >
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{t(item.label) || item.label}</span>
            </Link>
          ) : (
            <span className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
              index === items.length - 1
                ? 'text-txt font-semibold bg-primary/10'
                : 'text-txt-secondary'
            }`}>
              {item.icon && <span className="text-lg">{item.icon}</span>}
              <span>{t(item.label) || item.label}</span>
            </span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb; 