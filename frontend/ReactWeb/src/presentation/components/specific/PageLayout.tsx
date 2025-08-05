import React from 'react';

interface PageLayoutProps {
  children: React.ReactNode;
  background?: string;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  background = 'bg-bg',
  maxWidth = 'max-w-6xl',
  padding = 'px-6 py-8',
  className = '',
}) => {
  return (
    <div className={`min-h-screen ${background}`}>
      <div className={`${maxWidth} mx-auto ${padding} ${className}`}>
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
