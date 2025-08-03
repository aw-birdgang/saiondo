import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMessageController } from '../../providers/ControllerProvider';
import { useUserController } from '../../providers/ControllerProvider';
import { ChatMessageInput } from '../../components/chat/ChatMessageInput';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent,
  Button,
  Badge,
  StatusBadge,
  LoadingSpinner,
  Input
} from '../../components/common';
import { useToastContext } from '../../providers/ToastProvider';
import { cn } from '../../../utils/cn';

interface Message {
  id: string;
  content: string;
  senderId: string;
  senderName?: string;
  timestamp: Date;
  type: 'text' | 'image' | 'file' | 'system' | 'emoji';
  metadata?: any;
  isRead?: boolean;
  reactions?: Array<{
    emoji: string;
    count: number;
    users: string[];
  }>;
}

interface User {
  id: string;
  name?: string;
  avatar?: string;
  isOnline?: boolean;
}

const ChatPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [typingUsers, setTypingUsers] = useState<string[]>([]);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  
  const messageController = useMessageController();
  const userController = useUserController();
  const toast = useToastContext();

  // 현재 사용자 정보 로드
  useEffect(() => {
    const loadCurrentUser = async () => {
      try {
        const user = await userController.executeWithTracking(
          'getCurrentUser',
          {},
          async () => {
            await new Promise(resolve => setTimeout(resolve, 500));
            return {
              id: '1',
              name: 'John Doe',
              email: 'john@example.com',
              avatar: 'https://via.placeholder.com/150',
              isOnline: true
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
  }, [userController, toast]);

  // 메시지 로드
  useEffect(() => {
    if (!channelId) return;

    const loadMessages = async () => {
      setIsLoading(true);
      try {
        const recentMessages = await messageController.executeWithTracking(
          'searchMessages',
          { channelId, query: '', options: { limit: 50 } },
          async () => {
            await new Promise(resolve => setTimeout(resolve, 800));
            return [
              {
                id: '1',
                content: '안녕하세요! 👋',
                senderId: '2',
                senderName: 'Jane Smith',
                timestamp: new Date(Date.now() - 60000),
                type: 'text' as const,
                isRead: true,
                reactions: [
                  { emoji: '👍', count: 2, users: ['1', '3'] },
                  { emoji: '❤️', count: 1, users: ['4'] }
                ]
              },
              {
                id: '2',
                content: '반갑습니다! 오늘 날씨가 정말 좋네요 ☀️',
                senderId: '1',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 30000),
                type: 'text' as const,
                isRead: true
              },
              {
                id: '3',
                content: '프로젝트 진행상황 공유드립니다 📊',
                senderId: '3',
                senderName: 'Mike Johnson',
                timestamp: new Date(Date.now() - 15000),
                type: 'file' as const,
                metadata: { fileName: 'project_report.pdf', fileSize: '2.5MB' },
                isRead: false
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
  }, [channelId, messageController, toast]);

  // 메시지 전송 처리
  const handleMessageSent = useCallback((newMessage: Message) => {
    setMessages(prev => [...prev, newMessage]);
    scrollToBottom();
    toast.success('메시지가 전송되었습니다.');
  }, [toast]);

  // 메시지 검색
  const handleSearch = async () => {
    if (!searchQuery.trim() || !channelId) return;

    setIsSearching(true);
    try {
      const searchResults = await messageController.executeWithTracking(
        'searchMessages',
        { channelId, query: searchQuery, options: { limit: 20 } },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 600));
          return [
            {
              id: '3',
              content: `"${searchQuery}" 검색 결과입니다.`,
              senderId: '2',
              senderName: 'Jane Smith',
              timestamp: new Date(Date.now() - 120000),
              type: 'text' as const,
              isRead: true
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
          await new Promise(resolve => setTimeout(resolve, 800));
          return [
            {
              id: '1',
              content: '안녕하세요! 👋',
              senderId: '2',
              senderName: 'Jane Smith',
              timestamp: new Date(Date.now() - 60000),
              type: 'text' as const,
              isRead: true
            },
            {
              id: '2',
              content: '반갑습니다! 오늘 날씨가 정말 좋네요 ☀️',
              senderId: '1',
              senderName: 'John Doe',
              timestamp: new Date(Date.now() - 30000),
              type: 'text' as const,
              isRead: true
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
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 메시지 반응 추가
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev => prev.map(msg => {
      if (msg.id === messageId) {
        const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
        if (existingReaction) {
          return {
            ...msg,
            reactions: msg.reactions?.map(r => 
              r.emoji === emoji 
                ? { ...r, count: r.count + 1, users: [...r.users, currentUser?.id || ''] }
                : r
            )
          };
        } else {
          return {
            ...msg,
            reactions: [...(msg.reactions || []), { emoji, count: 1, users: [currentUser?.id || ''] }]
          };
        }
      }
      return msg;
    }));
  };

  // 메시지 렌더링
  const renderMessage = (message: Message) => {
    const isOwnMessage = message.senderId === currentUser?.id;
    
    return (
      <div
        key={message.id}
        className={cn(
          'group relative mb-4 transition-all duration-200 hover:bg-focus/50 rounded-lg p-2',
          selectedMessage === message.id && 'bg-focus'
        )}
        onClick={() => setSelectedMessage(message.id)}
      >
        <div className={`flex ${isOwnMessage ? 'justify-end' : 'justify-start'}`}>
          <div className="flex items-start space-x-3 max-w-xs lg:max-w-md">
            {!isOwnMessage && (
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-sm font-medium">
                  {message.senderName?.charAt(0) || 'U'}
                </div>
              </div>
            )}
            
            <div className="flex-1">
              {!isOwnMessage && (
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-txt">{message.senderName || 'Unknown User'}</span>
                  <StatusBadge status="online" showText={false} size="sm" />
                </div>
              )}
              
              <div
                className={cn(
                  'px-4 py-2 rounded-lg break-words',
                  isOwnMessage
                    ? 'bg-primary text-on-primary'
                    : 'bg-surface border border-border text-txt'
                )}
              >
                {message.type === 'text' && (
                  <div className="whitespace-pre-wrap">{message.content}</div>
                )}
                {message.type === 'file' && (
                  <div className="flex items-center gap-2 p-2 bg-focus rounded">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                    </svg>
                    <div className="flex-1">
                      <div className="font-medium">{message.metadata?.fileName || 'File'}</div>
                      <div className="text-xs text-txt-secondary">{message.metadata?.fileSize}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                      </svg>
                    </Button>
                  </div>
                )}
                {message.type === 'image' && (
                  <img
                    src={message.content}
                    alt="Shared image"
                    className="max-w-full h-auto rounded cursor-pointer hover:opacity-90 transition-opacity"
                  />
                )}
              </div>
              
              {/* 메시지 반응 */}
              {message.reactions && message.reactions.length > 0 && (
                <div className="flex flex-wrap gap-1 mt-2">
                  {message.reactions.map((reaction, index) => (
                    <button
                      key={index}
                      onClick={() => handleAddReaction(message.id, reaction.emoji)}
                      className="flex items-center space-x-1 px-2 py-1 bg-focus rounded-full text-xs hover:bg-focus/80 transition-colors"
                    >
                      <span>{reaction.emoji}</span>
                      <span className="text-txt-secondary">{reaction.count}</span>
                    </button>
                  ))}
                </div>
              )}
              
              <div className="flex items-center justify-between mt-1">
                <div className="flex items-center space-x-2">
                  <span className="text-xs text-txt-secondary">
                    {new Date(message.timestamp).toLocaleTimeString()}
                  </span>
                  {isOwnMessage && (
                    <div className="flex items-center space-x-1">
                      {message.isRead ? (
                        <svg className="w-3 h-3 text-primary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 011 1v1a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                        </svg>
                      ) : (
                        <svg className="w-3 h-3 text-txt-secondary" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z"/>
                          <path fillRule="evenodd" d="M4 5a2 2 0 012-2v1a1 1 0 001 1h6a1 1 0 011 1v1a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd"/>
                        </svg>
                      )}
                    </div>
                  )}
                </div>
                
                {/* 메시지 액션 버튼 */}
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleAddReaction(message.id, '👍')}
                    className="h-6 w-6 p-0"
                  >
                    👍
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (!currentUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        <LoadingSpinner size="lg" text="사용자 정보를 불러오는 중..." />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-bg">
      {/* 헤더 */}
      <Card className="rounded-none border-b border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div>
                <CardTitle className="text-lg">채널 #{channelId}</CardTitle>
                <div className="flex items-center space-x-2 mt-1">
                  <StatusBadge status="online" />
                  <span className="text-sm text-txt-secondary">
                    {messages.length}개의 메시지
                  </span>
                </div>
              </div>
            </div>
            
            {/* 검색 */}
            <div className="flex items-center gap-2">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="메시지 검색..."
                className="w-64"
                rightIcon={
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleSearch}
                    disabled={isSearching || !searchQuery.trim()}
                  >
                    {isSearching ? (
                      <LoadingSpinner size="sm" />
                    ) : (
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    )}
                  </Button>
                }
              />
              {searchQuery && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleClearSearch}
                >
                  초기화
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* 메시지 영역 */}
      <div 
        ref={messagesContainerRef}
        className="flex-1 overflow-y-auto p-4 space-y-4"
      >
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <LoadingSpinner size="lg" text="메시지를 불러오는 중..." />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-txt mb-2">아직 메시지가 없습니다</h3>
              <p className="text-txt-secondary">첫 번째 메시지를 보내보세요!</p>
            </div>
          </div>
        ) : (
          <>
            {messages.map(renderMessage)}
            <div ref={messagesEndRef} />
          </>
        )}
      </div>

      {/* 타이핑 표시 */}
      {typingUsers.length > 0 && (
        <div className="px-4 py-2 bg-focus/50 border-t border-border">
          <div className="flex items-center space-x-2">
            <LoadingSpinner size="sm" />
            <span className="text-sm text-txt-secondary">
              {typingUsers.join(', ')}님이 타이핑 중...
            </span>
          </div>
        </div>
      )}

      {/* 메시지 입력 */}
      <ChatMessageInput
        channelId={channelId || ''}
        userId={currentUser.id}
        onMessageSent={handleMessageSent}
        onTyping={() => setIsTyping(true)}
        onStopTyping={() => setIsTyping(false)}
      />
    </div>
  );
};

export default ChatPage;
