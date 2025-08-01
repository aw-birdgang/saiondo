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
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {title}
      </h3>
      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
        {content}
      </p>
    </div>
  );
};

export default AnalysisSection; 