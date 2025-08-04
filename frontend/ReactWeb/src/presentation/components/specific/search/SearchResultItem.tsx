import React from 'react';
import { cn } from '../../../../utils/cn';
import { SEARCH_TYPE_ICONS, SEARCH_TYPE_COLORS, highlightText } from '../../../pages/search/constants/searchData';
import type { SearchResultItemProps } from '../../../pages/search/types/searchTypes';

const SearchResultItem: React.FC<SearchResultItemProps> = ({
  result,
  onClick,
  className
}) => {
  const handleClick = () => {
    onClick(result);
  };

  const formatTime = (timestamp?: Date) => {
    if (!timestamp) return '';
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - timestamp.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return '방금 전';
    if (diffInMinutes < 60) return `${diffInMinutes}분 전`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}시간 전`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}일 전`;
    
    return timestamp.toLocaleDateString('ko-KR');
  };

  return (
    <div
      onClick={handleClick}
      className={cn(
        'p-4 border-b border-border cursor-pointer transition-colors',
        'hover:bg-focus',
        className
      )}
    >
      <div className="flex items-start space-x-3">
        {/* 타입 아이콘 */}
        <div className={cn(
          'flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white text-lg',
          SEARCH_TYPE_COLORS[result.type]
        )}>
          {SEARCH_TYPE_ICONS[result.type]}
        </div>

        {/* 결과 내용 */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              {/* 제목 */}
              <h3 className="font-medium text-txt mb-1">
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(result.title, result.highlights?.title?.[0] || '') 
                  }} 
                />
              </h3>
              
              {/* 설명 */}
              <p className="text-sm text-txt-secondary mb-2 line-clamp-2">
                <span 
                  dangerouslySetInnerHTML={{ 
                    __html: highlightText(result.description, result.highlights?.description?.[0] || '') 
                  }} 
                />
              </p>
              
              {/* 메타데이터 */}
              <div className="flex items-center space-x-4 text-xs text-txt-secondary">
                {/* 카테고리 */}
                {result.metadata.category && (
                  <span className="bg-focus px-2 py-1 rounded">
                    {result.metadata.category}
                  </span>
                )}
                
                {/* 발신자 */}
                {result.metadata.sender && (
                  <span>👤 {result.metadata.sender}</span>
                )}
                
                {/* 시간 */}
                {result.metadata.timestamp && (
                  <span>🕐 {formatTime(result.metadata.timestamp)}</span>
                )}
                
                {/* 관련도 */}
                {result.metadata.relevance && (
                  <span>📊 {Math.round(result.metadata.relevance * 100)}% 관련</span>
                )}
              </div>
              
              {/* 태그 */}
              {result.metadata.tags && result.metadata.tags.length > 0 && (
                <div className="flex items-center space-x-1 mt-2">
                  {result.metadata.tags.slice(0, 3).map((tag, index) => (
                    <span
                      key={index}
                      className="text-xs bg-primary/10 text-primary px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {result.metadata.tags.length > 3 && (
                    <span className="text-xs text-txt-secondary">
                      +{result.metadata.tags.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* 아바타 */}
            {result.metadata.avatar && (
              <div className="flex-shrink-0 ml-4">
                <img
                  src={result.metadata.avatar}
                  alt={result.title}
                  className="w-12 h-12 rounded-full object-cover"
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchResultItem; 