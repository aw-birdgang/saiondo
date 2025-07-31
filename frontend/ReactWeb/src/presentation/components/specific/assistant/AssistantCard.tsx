import React from 'react';
import { useTranslation } from 'react-i18next';

interface Assistant {
  id: string;
  name: string;
  description: string;
  avatar?: string;
  category: string;
  isActive: boolean;
  lastUsed?: Date;
  messageCount: number;
}

interface AssistantCardProps {
  assistant: Assistant;
  categoryName: string;
  categoryColor: string;
  categoryIcon: string;
  onClick: (assistant: Assistant) => void;
  className?: string;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  assistant,
  categoryName,
  categoryColor,
  categoryIcon,
  onClick,
  className = '',
}) => {
  const { t } = useTranslation();

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return '방금 전';
    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    if (days < 7) return `${days}일 전`;
    return date.toLocaleDateString();
  };

  return (
    <div
      className={`bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-all cursor-pointer hover:scale-[1.02] ${className}`}
      onClick={() => onClick(assistant)}
    >
      <div className="flex items-start space-x-4">
        {/* Avatar */}
        <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/20 dark:to-purple-900/20 rounded-full flex items-center justify-center flex-shrink-0">
          <span className="text-xl">
            {assistant.avatar || categoryIcon}
          </span>
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-3">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {assistant.name}
              </h3>
              <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColor}`}>
                <span className="mr-1">{categoryIcon}</span>
                {categoryName}
              </span>
              {assistant.isActive && (
                <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              )}
            </div>

            <div className="text-right">
              <div className="text-sm text-gray-500 dark:text-gray-400">
                {assistant.messageCount} {t('messages') || '메시지'}
              </div>
              {assistant.lastUsed && (
                <div className="text-xs text-gray-400">
                  {formatTime(assistant.lastUsed)}
                </div>
              )}
            </div>
          </div>

          <p className="text-gray-700 dark:text-gray-300 mb-3">
            {assistant.description}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
              <span className="flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                {t('start_chat') || '채팅 시작'}
              </span>
            </div>

            <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantCard; 