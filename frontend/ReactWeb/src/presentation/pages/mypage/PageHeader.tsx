import React from 'react';

interface PageHeaderProps {
  title: string;
  description?: string;
  icon?: React.ReactNode;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, description, icon }) => (
  <header className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
    <div className="flex items-center gap-3">
      {icon && (
        <span className="text-3xl sm:text-4xl text-blue-500 bg-blue-100 dark:bg-blue-900/20 rounded-lg p-2">
          {icon}
        </span>
      )}
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-1 leading-tight">
          {title}
        </h1>
        {description && (
          <p className="text-gray-600 dark:text-gray-300 text-base sm:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  </header>
);

export default PageHeader; 