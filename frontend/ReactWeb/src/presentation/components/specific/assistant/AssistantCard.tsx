import React from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Badge,
  Button,
} from '../../common';
import { cn } from '../../../../utils/cn';
import type { Assistant } from '../../../pages/assistant/types/assistantTypes';

interface AssistantCardProps {
  assistant: Assistant;
  onSelect: (assistant: Assistant) => void;
  className?: string;
  categoryName?: string;
  categoryColor?: string;
  categoryIcon?: string;
  onClick?: (assistant: Assistant) => void;
}

const AssistantCard: React.FC<AssistantCardProps> = ({
  assistant,
  onSelect,
  className,
}) => {
  const getCategoryIcon = (category: string) => {
    const iconMap: Record<string, string> = {
      relationship: '💕',
      emotion: '❤️',
      communication: '💬',
      conflict: '⚡',
      planning: '🎯',
      default: '🤖',
    };
    return iconMap[category] || iconMap.default;
  };

  const getCategoryColor = (category: string) => {
    const colorMap: Record<string, string> = {
      relationship: 'bg-pink-100 text-pink-800',
      emotion: 'bg-red-100 text-red-800',
      communication: 'bg-blue-100 text-blue-800',
      conflict: 'bg-yellow-100 text-yellow-800',
      planning: 'bg-green-100 text-green-800',
      default: 'bg-gray-100 text-gray-800',
    };
    return colorMap[category] || colorMap.default;
  };

  const formatLastUsed = (date?: Date) => {
    if (!date) return '사용 기록 없음';

    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return '방금 전';
    if (diffInHours < 24) return `${diffInHours}시간 전`;

    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;

    return date.toLocaleDateString();
  };

  return (
    <Card
      className={cn(
        'cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105',
        !assistant.isActive && 'opacity-60',
        className
      )}
      onClick={() => onSelect(assistant)}
    >
      <CardHeader className='pb-3'>
        <div className='flex items-start justify-between'>
          <div className='flex items-center space-x-3'>
            <div className='text-2xl'>
              {getCategoryIcon(assistant.category)}
            </div>
            <div className='flex-1'>
              <CardTitle className='text-lg font-semibold'>
                {assistant.name}
              </CardTitle>
              <Badge
                variant='secondary'
                className={cn('mt-1', getCategoryColor(assistant.category))}
              >
                {assistant.category}
              </Badge>
            </div>
          </div>
          <div className='flex items-center space-x-2'>
            {assistant.isActive && (
              <div className='w-2 h-2 bg-green-500 rounded-full'></div>
            )}
            <span className='text-xs text-txt-secondary'>
              {assistant.messageCount}개 대화
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className='pt-0'>
        <p className='text-sm text-txt-secondary mb-3 line-clamp-2'>
          {assistant.description}
        </p>

        <div className='flex items-center justify-between'>
          <span className='text-xs text-txt-secondary'>
            {formatLastUsed(assistant.lastUsed)}
          </span>

          <Button
            variant='outline'
            size='sm'
            onClick={e => {
              e.stopPropagation();
              onSelect(assistant);
            }}
            disabled={!assistant.isActive}
          >
            대화 시작
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AssistantCard;
