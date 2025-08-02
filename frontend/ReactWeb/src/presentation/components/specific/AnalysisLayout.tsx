import React from "react";

interface AnalysisLayoutProps {
  children: React.ReactNode;
  className?: string;
}

const AnalysisLayout: React.FC<AnalysisLayoutProps> = ({ 
  children, 
  className = "" 
}) => {
  return (
    <div className={`min-h-screen bg-bg ${className}`}>
      {children}
    </div>
  );
};

export default AnalysisLayout; 