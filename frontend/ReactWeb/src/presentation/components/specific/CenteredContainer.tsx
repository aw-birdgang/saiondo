import React from "react";

interface CenteredContainerProps {
  children: React.ReactNode;
  maxWidth?: string;
  className?: string;
}

const CenteredContainer: React.FC<CenteredContainerProps> = ({ 
  children, 
  maxWidth = "max-w-7xl", 
  className = "" 
}) => {
  return (
    <div className={`${maxWidth} mx-auto px-4 sm:px-6 lg:px-8 py-8 ${className}`}>
      {children}
    </div>
  );
};

export default CenteredContainer; 