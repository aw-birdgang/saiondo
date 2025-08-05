import React from 'react';
import { useTranslation } from 'react-i18next';
import { Caption } from './index';

interface AssistantStatsProps {
  messageCount: number;
  lastUsed?: Date;
  className?: string;
}

export const AssistantStats: React.FC<AssistantStatsProps> = ({
  messageCount,
  lastUsed,
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
    <div className={`text-right ${className}`}>
      <Caption>
        {messageCount} {t('messages') || '메시지'}
      </Caption>
      {lastUsed && (
        <Caption size='xs' color='muted'>
          {formatTime(lastUsed)}
        </Caption>
      )}
    </div>
  );
};

AssistantStats.displayName = 'AssistantStats';
