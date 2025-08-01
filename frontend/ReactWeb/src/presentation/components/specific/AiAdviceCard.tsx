import React from "react";
import { useTranslation } from "react-i18next";
import { ContentCard, Avatar, Text, ActionButton } from '../common';

interface AiAdviceCardProps {
  onStartChat: () => void;
  className?: string;
}

const AiAdviceCard: React.FC<AiAdviceCardProps> = ({ 
  onStartChat, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`card p-8 bg-gradient-to-br from-primary/5 to-primary/10 rounded-3xl border-2 border-primary/20 ${className}`}>
      {/* AI Icon */}
      <div className="flex justify-center mb-8">
        <div className="w-24 h-24 bg-gradient-to-br from-primary to-primary-container rounded-full flex items-center justify-center shadow-lg">
          <span className="text-5xl">🤖</span>
        </div>
      </div>

      {/* Title */}
      <h2 className="text-2xl font-bold text-text text-center mb-6 leading-tight">
        {t('ai_advice_bot') || 'AI 상담사'}
      </h2>

      {/* Description */}
      <p className="text-text-secondary text-center mb-8 leading-relaxed">
        {t('ai_advice_description') || 'AI 상담사와 대화하여 관계에 대한 조언을 받아보세요'}
      </p>

      {/* Start Chat Button */}
      <button
        onClick={onStartChat}
        className="btn btn-primary w-full py-4 text-lg font-semibold bg-gradient-to-r from-primary to-primary-container hover:from-primary-container hover:to-primary shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <span className="mr-3 text-xl">💬</span>
        {t('start_ai_advice_chat') || 'AI 상담사와 대화 시작'}
      </button>
    </div>
  );
};

export default AiAdviceCard; 