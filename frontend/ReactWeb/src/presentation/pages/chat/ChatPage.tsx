import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { useMessageController } from '../../providers/ControllerProvider';
import { useUserController } from '../../providers/ControllerProvider';
import { ChatMessageInput } from '../../components/chat/ChatMessageInput';
import { toast } from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system';
  metadata?: any;
}

interface User {
  id: string;
  name?: string;
  avatar?: string;
}

const ChatPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  const messageController = useMessageController();
  const userController = useUserController();

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await userController.executeWithTracking(
          'getCurrentUser',
          {},
          async () => {
            // 실제 사용자 정보 조회 로직 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://via.placeholder.com/150'
            };
          }
        );
        setCurrentUser(user);
      } catch (error) {
        console.error('사용자 정보 로드 실패:', error);
        toast.error('사용자 정보를 불러올 수 없습니다.');
      }
    };

    loadCurrentUser();
  }, [userController]);

  // 메시지 로드
  useEffect(() => {
    if (!channelId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        // 최근 메시지 검색 (빈 쿼리로 모든 메시지 조회)
        const recentMessages = await messageController.executeWithTracking(
          'searchMessages',
          { channelId, query: '', options: { limit: 50 } },
          async () => {
            // 실제 메시지 검색 로직 시뮬레이션
            await new Promise(resolve => setTimeout(resolve, 800));
            return [
              {
                id: '1',
                content: '안녕하세요!',
                senderId: '2',
                senderName: 'Jane Smith',
                timestamp: new Date(Date.now() - 60000),
                type: 'text' as const
              },
              {
                id: '2',
                content: '반갑습니다!',
                senderId: '1',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 30000),
                type: 'text' as const
              }
            ];
          }
        );
        setMessages(recentMessages);
      } catch (error) {
        console.error('메시지 로드 실패:', error);
        toast.error('메시지를 불러올 수 없습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    loadMessages();
  }, [channelId, messageController]);

  // 메시지 전송 처리
  const handleMessageSent = (newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
  };

  // 메시지 검색
  const handleSearch = async () => {
    if (!searchQuery.trim() || !channelId) return;

    setIsSearching(true);
    try {
      const searchResults = await messageController.executeWithTracking(
        'searchMessages',
        { channelId, query: searchQuery, options: { limit: 20 } },
        async () => {
          // 실제 메시지 검색 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 600));
          return [
            {
              id: '3',
              content: `"${searchQuery}" 검색 결과입니다.`,
              senderId: '2',
              senderName: 'Jane Smith',
              timestamp: new Date(Date.now() - 120000),
              type: 'text' as const
            }
          ];
        }
      );
      setMessages(searchResults);
      toast.success(`${searchResults.length}개의 메시지를 찾았습니다.`);
    } catch (error) {
      console.error('메시지 검색 실패:', error);
      toast.error('메시지 검색에 실패했습니다.');
    } finally {
      setIsSearching(false);
    }
  };

  // 검색 초기화
  const handleClearSearch = async () => {
    setSearchQuery('');
    if (!channelId) return;

    setIsSearching(true);
    try {
      const recentMessages = await messageController.executeWithTracking(
        'searchMessages',
        { channelId, query: '', options: { limit: 50 } },
        async () => {
          // 실제 메시지 검색 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 800));
          return [
            {
              id: '1',
              content: '안녕하세요!',
              senderId: '2',
              senderName: 'Jane Smith',
              timestamp: new Date(Date.now() - 60000),
              type: 'text' as const
            },
            {
              id: '2',
              content: '반갑습니다!',
              senderId: '1',
              senderName: 'John Doe',
              timestamp: new Date(Date.now() - 30000),
              type: 'text' as const
            }
          ];
        }
      );
      setMessages(recentMessages);
    } catch (error) {
      console.error('메시지 로드 실패:', error);
    } finally {
      setIsSearching(false);
    }
  };

  // 스크롤을 맨 아래로
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 메시지 렌더링
  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === currentUser?.id;
    
    return (
      <div
        key={message.id}
        className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'} mb-4`}
      >
        <div
          className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
            isOwnMessage
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white'
          }`}
        >
          {!isOwnMessage && (
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">
              {message.senderName || 'Unknown User'}
            </div>
          )}
          
          <div className="break-words">
            {message.type === 'text' && message.content}
            {message.type === 'file' && (
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                </svg>
                <span>{message.metadata?.fileName || 'File'}</span>
              </div>
            )}
            {message.type === 'image' && (
              <img
                src={message.content}
                alt="Shared image"
                className="max-w-full h-auto rounded"
              />
            )}
          </div>
          
          <div className={`text-xs mt-1 ${
            isOwnMessage ? 'text-blue-100' : 'text-gray-500 dark:text-gray-400'
          }`}>
            {new Date(message.timestamp).toLocaleTimeString()}
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">사용자 정보를 불러오는 중...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-900">
      {/* 헤더 */}
      <div className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
              채널 #{channelId}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {messages.length}개의 메시지
            </p>
          </div>
          
          {/* 검색 */}
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="메시지 검색..."
              className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
            <button
              onClick={handleSearch}
              disabled={isSearching || !searchQuery.trim()}
              className="px-3 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-50"
            >
              {isSearching ? '검색중...' : '검색'}
            </button>
            {searchQuery && (
              <button
                onClick={handleClearSearch}
                className="px-3 py-1 bg-gray-500 text-white rounded-lg text-sm hover:bg-gray-600"
              >
                초기화
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 메시지 영역 */}
      <div className="flex-1 overflow-y-auto p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2"></div>
              <p className="text-gray-600 dark:text-gray-400">메시지를 불러오는 중...</p>
            </div>
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <svg className="w-12 h-12 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
              <p className="text-gray-600 dark:text-gray-400">아직 메시지가 없습니다.</p>
              <p className="text-sm text-gray-500 dark:text-gray-500">첫 번째 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* 메시지 입력 */}
      <ChatMessageInput
        channelId={channelId || ''}
        userId={currentUser.id}
        onMessageSent={handleMessageSent}
      />
    </div>
  );
};

export default ChatPage;
