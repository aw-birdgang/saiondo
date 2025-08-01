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
    <div className={`min-h-screen bg-background ${className}`}>
      {children}
    </div>
  );
};

export default HomeTabLayout; 