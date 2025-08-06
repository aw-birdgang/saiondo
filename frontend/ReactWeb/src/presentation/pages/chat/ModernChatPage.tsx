import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMessageController } from '@/presentation/providers/ControllerProvider';
import { useUserController } from '@/presentation/providers/ControllerProvider';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { AuthGuard } from '@/presentation/components/specific';
import {
  Button,
  Input,
  Avatar,
  Badge,
  Skeleton,
  GlassmorphicCard,
  FloatingActionButton
} from '@/presentation/components/common';
import { useIntersectionAnimation, } from '@/shared/design-system/animations';
import { useTheme } from '@/shared/design-system/hooks';
import type { Message, User } from '@/presentation/pages/chat/types/chatTypes';

const ModernChatPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const messageController = useMessageController();
  const userController = useUserController();
  const toast = useToastContext();
  const { theme } = useTheme();

  // Animation hooks
  const { elementRef: headerRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');
  const { elementRef: inputRef } = useIntersectionAnimation('slideInUp', 0.2, '0px');

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
              isOnline: true,
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
                content: '안녕하세요! 👋 오늘도 좋은 하루 되세요!',
                senderId: '2',
                senderName: 'Jane Smith',
                timestamp: new Date(Date.now() - 60000),
                type: 'text' as const,
                isRead: true,
                reactions: [
                  { emoji: '👍', count: 2, users: ['1', '3'] },
                  { emoji: '❤️', count: 1, users: ['4'] },
                ],
              },
              {
                id: '2',
                content: '반갑습니다! 오늘 날씨가 정말 좋네요 ☀️ 산책하기 딱 좋은 날씨예요!',
                senderId: '1',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 30000),
                type: 'text' as const,
                isRead: true,
              },
              {
                id: '3',
                content: '프로젝트 진행상황 공유드립니다 📊 이번 주까지 완료 예정입니다.',
                senderId: '3',
                senderName: 'Mike Johnson',
                timestamp: new Date(Date.now() - 15000),
                type: 'file' as const,
                metadata: { fileName: 'project_report.pdf', fileSize: '2.5MB' },
                isRead: false,
              },
              {
                id: '4',
                content: '회의 일정 조율 부탁드립니다 📅 언제가 편하신가요?',
                senderId: '4',
                senderName: 'Sarah Wilson',
                timestamp: new Date(Date.now() - 5000),
                type: 'text' as const,
                isRead: false,
              },
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
  const handleSendMessage = useCallback(async () => {
    if (!newMessage.trim() || !currentUser || !channelId) return;

    const messageToSend: Message = {
      id: Date.now().toString(),
      content: newMessage,
      senderId: currentUser.id,
      senderName: currentUser.name,
      timestamp: new Date(),
      type: 'text',
      isRead: false,
    };

    try {
      await messageController.executeWithTracking(
        'sendMessage',
        { channelId, message: messageToSend },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 300));
          return messageToSend;
        }
      );

      setMessages(prev => [...prev, messageToSend]);
      setNewMessage('');
      scrollToBottom();
      toast.success('메시지가 전송되었습니다.');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      toast.error('메시지 전송에 실패했습니다.');
    }
  }, [newMessage, currentUser, channelId, messageController, toast]);

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
              isRead: true,
            },
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

  // 스크롤을 맨 아래로
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  // 메시지 반응 추가
  const handleAddReaction = (messageId: string, emoji: string) => {
    setMessages(prev =>
      prev.map(msg => {
        if (msg.id === messageId) {
          const existingReaction = msg.reactions?.find(r => r.emoji === emoji);
          if (existingReaction) {
            return {
              ...msg,
              reactions: msg.reactions?.map(r =>
                r.emoji === emoji
                  ? {
                      ...r,
                      count: r.count + 1,
                      users: [...r.users, currentUser?.id || ''],
                    }
                  : r
              ),
            };
          } else {
            return {
              ...msg,
              reactions: [
                ...(msg.reactions || []),
                { emoji, count: 1, users: [currentUser?.id || ''] },
              ],
            };
          }
        }
        return msg;
      })
    );
  };

  // 키보드 이벤트 처리
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-20 w-full" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <AuthGuard requireAuth={true}>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        {/* Header */}
        <header ref={headerRef} className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-gray-800/80 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                                 <Avatar
                   src={currentUser.avatar}
                   fallback={currentUser.name?.charAt(0) || 'U'}
                   size="lg"
                   className="ring-2 ring-primary/20"
                 />
                <div>
                  <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                    채팅방 #{channelId}
                  </h1>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {messages.length}개의 메시지
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Badge variant="success" className="flex items-center space-x-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>온라인</span>
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => toast.info('설정 메뉴')}
                >
                  ⚙️
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Search Bar */}
        <div className="bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-3">
            <div className="flex space-x-3">
              <Input
                placeholder="메시지 검색..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                variant="modern"
                className="flex-1"
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <Button
                variant="primary"
                size="sm"
                onClick={handleSearch}
                loading={isSearching}
              >
                검색
              </Button>
            </div>
          </div>
        </div>

        {/* Messages Container */}
        <div className="flex-1 overflow-hidden">
          <div
            ref={messagesContainerRef}
            className="h-[calc(100vh-200px)] overflow-y-auto px-4 py-6 space-y-4"
          >
            {isLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="flex space-x-3">
                    <Skeleton className="w-10 h-10 rounded-full" />
                    <div className="flex-1 space-y-2">
                      <Skeleton className="h-4 w-24" />
                      <Skeleton className="h-16 w-full" />
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              messages.map((message, index) => (
                <div
                  key={message.id}
                  className={`flex space-x-3 ${
                    message.senderId === currentUser.id ? 'flex-row-reverse space-x-reverse' : ''
                  }`}
                >
                                     <Avatar
                     src={`https://via.placeholder.com/40?text=${message.senderName?.charAt(0) || 'U'}`}
                     fallback={message.senderName?.charAt(0) || 'U'}
                     size="md"
                     className="flex-shrink-0"
                   />

                  <div className={`flex-1 max-w-[70%] ${
                    message.senderId === currentUser.id ? 'text-right' : ''
                  }`}>
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">
                        {message.senderName}
                      </span>
                      <span className="text-xs text-gray-500">
                        {message.timestamp.toLocaleTimeString()}
                      </span>
                      {!message.isRead && message.senderId === currentUser.id && (
                        <Badge variant="secondary" size="sm">읽지 않음</Badge>
                      )}
                    </div>

                    <GlassmorphicCard className={`p-4 ${
                      message.senderId === currentUser.id 
                        ? 'bg-primary/10 border-primary/20' 
                        : 'bg-white/20 border-white/30'
                    }`}>
                      <div className="text-gray-900 dark:text-white">
                        {message.content}
                      </div>

                      {message.type === 'file' && (
                        <div className="mt-2 p-2 bg-white/50 dark:bg-gray-700/50 rounded-lg">
                          <div className="flex items-center space-x-2">
                            <span className="text-2xl">📎</span>
                            <div>
                              <div className="text-sm font-medium">
                                {message.metadata?.fileName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {message.metadata?.fileSize}
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {message.reactions && message.reactions.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-2">
                          {message.reactions.map((reaction, idx) => (
                            <Button
                              key={idx}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs"
                              onClick={() => handleAddReaction(message.id, reaction.emoji)}
                            >
                              {reaction.emoji} {reaction.count}
                            </Button>
                          ))}
                        </div>
                      )}
                    </GlassmorphicCard>
                  </div>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div ref={inputRef} className="sticky bottom-0 bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4">
            <div className="flex space-x-3">
                             <Input
                 placeholder="메시지를 입력하세요..."
                 value={newMessage}
                 onChange={(e) => setNewMessage(e.target.value)}
                 onKeyPress={handleKeyPress}
                 variant="modern"
                 className="flex-1"
               />
              <Button
                variant="primary"
                onClick={handleSendMessage}
                disabled={!newMessage.trim()}
                className="px-6"
              >
                전송
              </Button>
            </div>
          </div>
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
          }
          label="새 메시지"
          variant="primary"
          size="md"
          position="bottom-right"
          onClick={() => {
            setNewMessage('');
            document.querySelector('input[placeholder="메시지를 입력하세요..."]')?.focus();
          }}
        />

        <FloatingActionButton
          icon={
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16l-4-4m0 0l4-4m-4 4h18" />
            </svg>
          }
          label="스크롤 위로"
          variant="secondary"
          size="sm"
          position="bottom-left"
          onClick={() => {
            messagesContainerRef.current?.scrollTo({
              top: 0,
              behavior: 'smooth'
            });
          }}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernChatPage;
