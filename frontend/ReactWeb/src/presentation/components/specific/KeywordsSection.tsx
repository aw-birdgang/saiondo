import React from "react";
import { useTranslation } from "react-i18next";
import { KeywordTag } from "../common";

interface KeywordsSectionProps {
  keywords: string[];
  className?: string;
}

const KeywordsSection: React.FC<KeywordsSectionProps> = ({ 
  keywords, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        {t("main_keywords")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {keywords.map((keyword, index) => (
          <KeywordTag
            key={index}
            keyword={keyword}
            variant="primary"
            size="md"
          />
        ))}
      </div>
    </div>
  );
};

export default KeywordsSection; 