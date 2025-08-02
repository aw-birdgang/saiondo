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
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-lg">👥</span>
        </div>
        <h3 className="text-xl font-semibold text-txt">
          성향 분석
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {persona1 && (
          <div className="bg-secondary rounded-lg p-6">
            <h4 className="font-semibold text-txt mb-3 flex items-center">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs">1</span>
              </span>
              {t("user1_persona") || "사용자 1 성향"}
            </h4>
            <p className="text-txt-secondary leading-relaxed">
              {persona1}
            </p>
          </div>
        )}
        
        {persona2 && (
          <div className="bg-secondary rounded-lg p-6">
            <h4 className="font-semibold text-txt mb-3 flex items-center">
              <span className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center mr-2">
                <span className="text-xs">2</span>
              </span>
              {t("user2_persona") || "사용자 2 성향"}
            </h4>
            <p className="text-txt-secondary leading-relaxed">
              {persona2}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PersonasSection; 