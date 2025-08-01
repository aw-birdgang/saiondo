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
      <h1 className="text-3xl font-bold text-text mb-6 leading-tight">
        {t('welcome_title') || 'Saiondo에 오신 것을 환영합니다'}
      </h1>
      <p className="text-text-secondary text-lg leading-relaxed max-w-2xl mx-auto">
        {t('welcome_message') || 'AI 상담사와 함께 더 나은 관계를 만들어보세요'}
      </p>
    </div>
  );
};

export default WelcomeMessage; 