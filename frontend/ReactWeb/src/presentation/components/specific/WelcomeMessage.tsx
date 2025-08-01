import React from "react";
import { useTranslation } from "react-i18next";

interface WelcomeMessageProps {
  className?: string;
}

const WelcomeMessage: React.FC<WelcomeMessageProps> = ({ 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`text-center ${className}`}>
      <p className="text-gray-600 dark:text-gray-400 text-sm">
        {t('welcome_message')}
      </p>
    </div>
  );
};

export default WelcomeMessage; 