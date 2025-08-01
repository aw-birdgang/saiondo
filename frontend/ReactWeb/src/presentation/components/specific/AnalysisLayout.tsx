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
    <div className={`min-h-screen bg-gray-50 ${className}`}>
      {children}
    </div>
  );
};

export default AnalysisLayout; 