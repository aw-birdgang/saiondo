import React from "react";

interface PageContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  padding?: string;
  className?: string;
}

const PageContainer: React.FC<PageContainerProps> = ({ 
  children, 
  maxWidth = "max-w-4xl", 
  padding = "px-4 py-6", 
  className = "" 
}) => {
  return (
    <div className={`${maxWidth} mx-auto ${padding} ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer; 