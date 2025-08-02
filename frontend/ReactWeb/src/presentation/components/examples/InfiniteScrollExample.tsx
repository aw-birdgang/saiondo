import React, { useState, useCallback } from 'react';
import { useInfiniteScroll } from '../../hooks/useInfiniteScroll';

interface Message {
  id: number;
  text: string;
  timestamp: string;
}

const InfiniteScrollExample: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  // Mock data loading function
  const loadMoreMessages = useCallback(async () => {
    setIsLoading(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const newMessages: Message[] = Array.from({ length: 10 }, (_, index) => ({
      id: messages.length + index + 1,
      text: `메시지 ${messages.length + index + 1}`,
      timestamp: new Date().toISOString()
    }));

    setMessages(prev => [...prev, ...newMessages]);
    
    // Stop loading more after 50 messages
    if (messages.length + newMessages.length >= 50) {
      setHasMore(false);
    }
    
    setIsLoading(false);
  }, [messages.length]);

  const { ref, isLoadingMore, hasMore: hasMoreData } = useInfiniteScroll({
    data: messages,
    hasMore,
    loading: isLoading,
    onLoadMore: loadMoreMessages,
    threshold: 0.1,
    rootMargin: '100px',
    throttleDelay: 100
  });

  return (
    <div className="max-w-md mx-auto p-6">
      <h2 className="text-2xl font-bold mb-6">무한 스크롤 예시</h2>
      
      <div className="space-y-4 max-h-96 overflow-y-auto border rounded-lg p-4">
        {messages.map((message) => (
          <div key={message.id} className="p-3 bg-gray-100 rounded-lg">
            <p className="font-medium">{message.text}</p>
            <p className="text-sm text-gray-500">{message.timestamp}</p>
          </div>
        ))}
        
        {/* Loading indicator */}
        {isLoadingMore && (
          <div className="text-center py-4">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">더 많은 메시지를 불러오는 중...</p>
          </div>
        )}
        
        {/* Intersection observer target */}
        <div ref={ref} className="h-4" />
        
        {/* End message */}
        {!hasMoreData && messages.length > 0 && (
          <div className="text-center py-4 text-gray-500">
            모든 메시지를 불러왔습니다.
          </div>
        )}
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>총 메시지: {messages.length}개</p>
        <p>더 불러올 수 있음: {hasMoreData ? '예' : '아니오'}</p>
      </div>
    </div>
  );
};

export default InfiniteScrollExample; 