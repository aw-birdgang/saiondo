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
    <ContentCard variant="elevated" padding="xl" className={`bg-gradient-to-br from-blue-100 to-pink-50 dark:from-blue-900/20 dark:to-pink-900/20 rounded-3xl ${className}`}>
      {/* AI Icon */}
      <div className="flex justify-center mb-6">
        <Avatar
          fallback="🤖"
          size="2xl"
          variant="gradient"
          className="shadow-lg"
        />
      </div>

      {/* Title */}
      <Text variant="h2" align="center" color="info" className="mb-4">
        {t('ai_advice_bot')}
      </Text>

      {/* Description */}
      <Text align="center" color="secondary" className="mb-8 leading-relaxed">
        {t('ai_advice_description')}
      </Text>

      {/* Start Chat Button */}
      <ActionButton
        onClick={onStartChat}
        variant="primary"
        size="lg"
        fullWidth
        className="bg-gradient-to-r from-pink-500 to-blue-500 hover:from-pink-600 hover:to-blue-600 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
      >
        <span className="mr-3">💬</span>
        {t('start_ai_advice_chat')}
      </ActionButton>
    </ContentCard>
  );
};

export default AiAdviceCard; 