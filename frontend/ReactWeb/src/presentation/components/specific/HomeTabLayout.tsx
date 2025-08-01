import React from "react";

interface HomeTabLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const HomeTabLayout: React.FC<HomeTabLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-blue-50 dark:bg-blue-900/10 ${className}`}>
      {children}
    </div>
  );
};

export default HomeTabLayout; 