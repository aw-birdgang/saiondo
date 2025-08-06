import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { useMessageController } from '../../providers/ControllerProvider';
import { useUserController } from '../../providers/ControllerProvider';
import { ChatMessageInput } from '../../components/chat/ChatMessageInput';
import { useToastContext } from '../../providers/ToastProvider';
import { AuthGuard } from '../../components/specific';
import {
  ChatContainer,
  ChatHeader,
  MessageList,
  TypingIndicator,
} from '../../components/specific/chat';
import type { Message, User } from './types/chatTypes';

const ChatPage: React.FC = () => {
  const { channelId } = useParams<{ channelId: string }>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  // const [isTyping, setIsTyping] = useState(false);
  // const [typingUsers, setTypingUsers] = useState<string[]>([]);
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
                content: '안녕하세요! 👋',
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
                content: '반갑습니다! 오늘 날씨가 정말 좋네요 ☀️',
                senderId: '1',
                senderName: 'John Doe',
                timestamp: new Date(Date.now() - 30000),
                type: 'text' as const,
                isRead: true,
              },
              {
                id: '3',
                content: '프로젝트 진행상황 공유드립니다 📊',
                senderId: '3',
                senderName: 'Mike Johnson',
                timestamp: new Date(Date.now() - 15000),
                type: 'file' as const,
                metadata: { fileName: 'project_report.pdf', fileSize: '2.5MB' },
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
  const handleMessageSent = useCallback(
    (newMessage: Message) => {
      setMessages(prev => [...prev, newMessage]);
      scrollToBottom();
      toast.success('메시지가 전송되었습니다.');
    },
    [toast]
  );

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
              isRead: true,
            },
            {
              id: '2',
              content: '반갑습니다! 오늘 날씨가 정말 좋네요 ☀️',
              senderId: '1',
              senderName: 'John Doe',
              timestamp: new Date(Date.now() - 30000),
              type: 'text' as const,
              isRead: true,
            },
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

  if (!currentUser) {
    return null;
  }

  return (
    <AuthGuard requireAuth={true}>
      <ChatContainer>
        <ChatHeader
          channelId={channelId || ''}
          messageCount={messages.length}
          searchQuery={searchQuery}
          isSearching={isSearching}
          onSearchChange={setSearchQuery}
          onSearch={handleSearch}
          onClearSearch={handleClearSearch}
        />

        <MessageList
          ref={messagesContainerRef}
          messages={messages}
          isLoading={isLoading}
          currentUserId={currentUser.id}
          selectedMessage={selectedMessage}
          onSelectMessage={setSelectedMessage}
          onAddReaction={handleAddReaction}
        />

        <div ref={messagesEndRef} />

        <TypingIndicator typingUsers={[]} />

        <ChatMessageInput
          channelId={channelId || ''}
          userId={currentUser.id}
          onMessageSent={handleMessageSent}
          onTyping={() => {}}
          onStopTyping={() => {}}
        />
      </ChatContainer>
    </AuthGuard>
  );
};

export default ChatPage;
