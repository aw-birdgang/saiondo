import React from "react";

interface PageBackgroundProps {
  children: React.ReactNode;
  background?: string;
  className?: string;
}

const PageBackground: React.FC<PageBackgroundProps> = ({ 
  children, 
  background = "bg-background", 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen ${background} ${className}`}>
      {children}
    </div>
  );
};

export default PageBackground; 