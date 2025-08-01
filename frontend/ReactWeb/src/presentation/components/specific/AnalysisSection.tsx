import React from "react";
import { useTranslation } from "react-i18next";

interface AnalysisSectionProps {
  title: string;
  content: string;
  className?: string;
}

const AnalysisSection: React.FC<AnalysisSectionProps> = ({ 
  title, 
  content, 
  className = "" 
}) => {
  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">📝</span>
        </div>
        <h3 className="text-xl font-semibold text-text leading-tight">
          {title}
        </h3>
      </div>
      
      <div className="bg-secondary rounded-lg p-6">
        <p className="text-text-secondary leading-relaxed">
          {content}
        </p>
      </div>
    </div>
  );
};

export default AnalysisSection; 