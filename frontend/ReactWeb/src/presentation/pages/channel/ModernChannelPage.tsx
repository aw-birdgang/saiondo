import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToastContext } from '@/presentation/providers/ToastProvider';
import { AuthGuard } from '@/presentation/components';
import {
  Button,
  Input,
  Badge,
  Skeleton,
  GlassmorphicCard,
  NeumorphicCard,
  FloatingActionButton,
  Avatar
} from '@/presentation/components/common';
import { useIntersectionAnimation, useStaggerAnimation } from '@/shared/design-system/animations';
import { useTheme } from '@/shared/design-system/hooks';

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isPrivate: boolean;
  lastMessage?: string;
  lastMessageTime?: Date;
  unreadCount: number;
  avatar?: string;
}

interface ChannelStats {
  totalChannels: number;
  activeChannels: number;
  totalMembers: number;
  messagesToday: number;
}

const ModernChannelPage: React.FC = () => {
  const navigate = useNavigate();
  const toast = useToastContext();
  const { theme, toggleTheme } = useTheme();
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Animation hooks
  const { elementRef: headerRef } = useIntersectionAnimation('slideInDown', 0.1, '0px');
  const { elementRef: statsRef } = useIntersectionAnimation('fadeIn', 0.2, '0px');
  const { elementRef: channelsRef } = useIntersectionAnimation('slideInUp', 0.3, '0px');

  // Mock data
  const [channels] = useState<Channel[]>([
    {
      id: '1',
      name: '일반',
      description: '전체 공지사항과 일반적인 대화',
      memberCount: 45,
      isPrivate: false,
      lastMessage: '오늘 회의 일정 확인 부탁드립니다.',
      lastMessageTime: new Date(Date.now() - 300000),
      unreadCount: 3,
      avatar: '💬'
    },
    {
      id: '2',
      name: '프로젝트-A',
      description: 'A 프로젝트 관련 논의',
      memberCount: 12,
      isPrivate: true,
      lastMessage: '디자인 리뷰 완료되었습니다.',
      lastMessageTime: new Date(Date.now() - 600000),
      unreadCount: 0,
      avatar: '🚀'
    },
    {
      id: '3',
      name: '개발팀',
      description: '개발 관련 기술 논의',
      memberCount: 8,
      isPrivate: false,
      lastMessage: '새로운 라이브러리 도입 검토 중',
      lastMessageTime: new Date(Date.now() - 900000),
      unreadCount: 7,
      avatar: '💻'
    },
    {
      id: '4',
      name: '디자인팀',
      description: 'UI/UX 디자인 논의',
      memberCount: 6,
      isPrivate: false,
      lastMessage: '컬러 팔레트 업데이트 완료',
      lastMessageTime: new Date(Date.now() - 1200000),
      unreadCount: 2,
      avatar: '🎨'
    },
    {
      id: '5',
      name: '마케팅',
      description: '마케팅 전략 및 캠페인',
      memberCount: 15,
      isPrivate: false,
      lastMessage: 'Q1 마케팅 계획 수립 중',
      lastMessageTime: new Date(Date.now() - 1800000),
      unreadCount: 0,
      avatar: '📢'
    },
    {
      id: '6',
      name: '운영팀',
      description: '서비스 운영 및 고객 지원',
      memberCount: 10,
      isPrivate: false,
      lastMessage: '서버 점검 완료',
      lastMessageTime: new Date(Date.now() - 3600000),
      unreadCount: 1,
      avatar: '⚙️'
    }
  ]);

  const [stats] = useState<ChannelStats>({
    totalChannels: 6,
    activeChannels: 4,
    totalMembers: 96,
    messagesToday: 156
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleChannelClick = (channelId: string) => {
    navigate(`/chat/${channelId}`);
  };

  const handleCreateChannel = () => {
    toast.info('새 채널 생성 기능은 준비 중입니다.');
  };

  const handleJoinChannel = (channelId: string) => {
    toast.success('채널에 참여했습니다!');
    handleChannelClick(channelId);
  };

  const filteredChannels = channels.filter(channel => {
    const matchesSearch = channel.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         channel.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' ||
                           (selectedCategory === 'private' && channel.isPrivate) ||
                           (selectedCategory === 'public' && !channel.isPrivate);
    return matchesSearch && matchesCategory;
  });

  const categories = [
    { id: 'all', label: '전체', icon: '📋' },
    { id: 'public', label: '공개', icon: '🌐' },
    { id: 'private', label: '비공개', icon: '🔒' }
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="space-y-6">
            <Skeleton className="h-16 w-full" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <div className="space-y-4">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-24 w-full" />
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
        <header ref={headerRef} className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  채널
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                  팀과 함께 소통하고 협업하세요
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleTheme}
                  className="rounded-full"
                >
                  {theme === 'dark' ? '🌞' : '🌙'}
                </Button>
                <Button
                  variant="primary"
                  onClick={handleCreateChannel}
                >
                  새 채널 만들기
                </Button>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <div className="container mx-auto px-4 py-8">
          {/* Stats Section */}
          <div ref={statsRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <GlassmorphicCard className="p-6 text-center">
              <div className="text-3xl text-blue-600 mb-2">📋</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalChannels}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                총 채널
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6 text-center">
              <div className="text-3xl text-green-600 mb-2">🌐</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.activeChannels}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                활성 채널
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6 text-center">
              <div className="text-3xl text-purple-600 mb-2">👥</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.totalMembers}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                총 멤버
              </div>
            </GlassmorphicCard>

            <GlassmorphicCard className="p-6 text-center">
              <div className="text-3xl text-orange-600 mb-2">💬</div>
              <div className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stats.messagesToday}
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                오늘 메시지
              </div>
            </GlassmorphicCard>
          </div>

          {/* Search and Filter */}
          <div className="mb-6 space-y-4">
            <Input
              placeholder="채널 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              variant="modern"
              className="max-w-md"
            />

            <div className="flex space-x-2">
              {categories.map(category => (
                <Button
                  key={category.id}
                  variant={selectedCategory === category.id ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedCategory(category.id)}
                  className="flex items-center space-x-2"
                >
                  <span>{category.icon}</span>
                  <span>{category.label}</span>
                </Button>
              ))}
            </div>
          </div>

          {/* Channels List */}
          <div ref={channelsRef} className="space-y-4">
            {filteredChannels.map((channel, index) => (
              <NeumorphicCard
                key={channel.id}
                className="p-6 cursor-pointer hover:scale-105 transition-all duration-200"
                onClick={() => handleChannelClick(channel.id)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-3xl">{channel.avatar}</div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                          {channel.name}
                        </h3>
                        {channel.isPrivate && (
                          <Badge variant="secondary" size="sm">비공개</Badge>
                        )}
                                                 {channel.unreadCount > 0 && (
                           <Badge variant="destructive" size="sm">{channel.unreadCount}</Badge>
                         )}
                      </div>
                      <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {channel.description}
                      </p>
                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>👥 {channel.memberCount}명</span>
                        {channel.lastMessage && (
                          <span>💬 {channel.lastMessageTime?.toLocaleTimeString()}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {channel.lastMessage && (
                      <div className="text-right">
                        <p className="text-sm text-gray-600 dark:text-gray-400 truncate max-w-xs">
                          {channel.lastMessage}
                        </p>
                        <p className="text-xs text-gray-500">
                          {channel.lastMessageTime?.toLocaleTimeString()}
                        </p>
                      </div>
                    )}
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleJoinChannel(channel.id);
                      }}
                    >
                      참여
                    </Button>
                  </div>
                </div>
              </NeumorphicCard>
            ))}
          </div>

          {filteredChannels.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🔍</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                채널을 찾을 수 없습니다
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                검색어를 변경하거나 새 채널을 만들어보세요
              </p>
            </div>
          )}
        </div>

        {/* Floating Action Buttons */}
        <FloatingActionButton
          icon="➕"
          label="새 채널"
          variant="primary"
          size="lg"
          position="bottom-right"
          onClick={handleCreateChannel}
        />

        <FloatingActionButton
          icon="🔍"
          label="채널 검색"
          variant="secondary"
          size="md"
          position="bottom-left"
          onClick={() => document.querySelector('input[placeholder="채널 검색..."]')?.focus()}
        />
      </div>
    </AuthGuard>
  );
};

export default ModernChannelPage;
