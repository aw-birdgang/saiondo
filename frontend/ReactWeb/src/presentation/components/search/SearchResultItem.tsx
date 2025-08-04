import React from 'react';
import { useTranslation } from 'react-i18next';
import { Badge } from '../common';
import { cn } from '../../../utils/cn';
import type { SearchResult } from '../../../domain/types/search';

interface SearchResultItemProps {
  result: SearchResult;
  onClick: (result: SearchResult) => void;
  className?: string;
}

const getTypeIcon = (type: SearchResult['type']) => {
  switch (type) {
    case 'user':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
        </svg>
      );
    case 'channel':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 5a2 2 0 012-2h7a2 2 0 012 2v4a2 2 0 01-2 2H9l-3 3v-3H4a2 2 0 01-2-2V5z" />
          <path d="M15 7v2a4 4 0 01-4 4H9.828l-1.766 1.767c.28.149.599.233.938.233h2l3 3v-3h2a2 2 0 002-2V9a2 2 0 00-2-2h-1z" />
        </svg>
      );
    case 'message':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
        </svg>
      );
    case 'analysis':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
        </svg>
      );
    case 'assistant':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
        </svg>
      );
    case 'category':
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
        </svg>
      );
    default:
      return (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      );
  }
};

const getTypeLabel = (type: SearchResult['type']) => {
  switch (type) {
    case 'user': return '사용자';
    case 'channel': return '채널';
    case 'message': return '메시지';
    case 'analysis': return '분석';
    case 'assistant': return 'AI 상담사';
    case 'category': return '카테고리';
    default: return '기타';
  }
};

const getTypeColor = (type: SearchResult['type']) => {
  switch (type) {
    case 'user': return 'bg-blue-100 text-blue-800';
    case 'channel': return 'bg-green-100 text-green-800';
    case 'message': return 'bg-purple-100 text-purple-800';
    case 'analysis': return 'bg-orange-100 text-orange-800';
    case 'assistant': return 'bg-pink-100 text-pink-800';
    case 'category': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onClick,
  className
}) => {
  const { t } = useTranslation();

  const formatTimestamp = (timestamp?: Date) => {
    if (!timestamp) return '';
    
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 60) return `${minutes}분 전`;
    if (hours < 24) return `${hours}시간 전`;
    return `${days}일 전`;
  };

  return (
    <div
      className={cn(
        'p-4 border border-border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-surface',
        className
      )}
      onClick={() => onClick(result)}
    >
      <div className="flex items-start space-x-3">
        {/* 아이콘 */}
        <div className={cn('p-2 rounded-lg', getTypeColor(result.type))}>
          {getTypeIcon(result.type)}
        </div>

        {/* 콘텐츠 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h3 className="text-lg font-medium text-txt truncate">
                {result.title}
              </h3>
              <p className="text-txt-secondary mt-1 line-clamp-2">
                {result.description}
              </p>
            </div>
            
            {/* 메타데이터 */}
            <div className="flex flex-col items-end space-y-1 ml-4">
              <Badge variant="secondary" className={getTypeColor(result.type)}>
                {getTypeLabel(result.type)}
              </Badge>
              {result.metadata.timestamp && (
                <span className="text-xs text-txt-secondary">
                  {formatTimestamp(result.metadata.timestamp)}
                </span>
              )}
            </div>
          </div>

          {/* 태그 */}
          {result.metadata.tags && result.metadata.tags.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {result.metadata.tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 text-xs bg-secondary text-txt-secondary rounded"
                >
                  {tag}
                </span>
              ))}
              {result.metadata.tags.length > 3 && (
                <span className="px-2 py-1 text-xs text-txt-secondary">
                  +{result.metadata.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* 관련도 점수 */}
          {result.metadata.relevance && (
            <div className="mt-2 text-xs text-txt-secondary">
              관련도: {Math.round(result.metadata.relevance * 100)}%
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 