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
    <div className={`${maxWidth} mx-auto px-6 sm:px-8 lg:px-10 py-10 ${className}`}>
      {children}
    </div>
  );
};

export default CenteredContainer; 