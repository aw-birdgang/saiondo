import React from "react";
import { cn } from "../../../utils/cn";
import type { AnalysisLayoutProps } from "../../pages/analysis/types/analysisTypes";

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