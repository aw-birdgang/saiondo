import React from "react";
import { useTranslation } from "react-i18next";
import AnalysisSection from "./AnalysisSection";

interface PersonasSectionProps {
  persona1?: string;
  persona2?: string;
  className?: string;
}

const PersonasSection: React.FC<PersonasSectionProps> = ({ 
  persona1, 
  persona2, 
  className = "" 
}) => {
  const { t } = useTranslation();

  if (!persona1 && !persona2) {
    return null;
  }

  return (
    <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        성향 분석
      </h3>
      {persona1 && (
        <div className="mb-4">
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {t("user1_persona")}
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {persona1}
          </p>
        </div>
      )}
      {persona2 && (
        <div>
          <h4 className="font-medium text-gray-900 dark:text-white mb-2">
            {t("user2_persona")}
          </h4>
          <p className="text-gray-700 dark:text-gray-300">
            {persona2}
          </p>
        </div>
      )}
    </div>
  );
};

export default PersonasSection; 