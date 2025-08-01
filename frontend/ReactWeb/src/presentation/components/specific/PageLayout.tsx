import React from "react";

interface PageLayoutProps {
  children: React.ReactNode;
  background?: string;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  background = "bg-gray-50 dark:bg-dark-surface", 
  maxWidth = "max-w-4xl", 
  padding = "px-4 py-6", 
  className = "" 
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