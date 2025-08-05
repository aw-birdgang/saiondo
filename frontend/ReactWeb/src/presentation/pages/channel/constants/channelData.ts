import type { ChannelListItem, ChannelStats } from '../types/channelTypes';

// Mock 채널 데이터
export const MOCK_CHANNELS: ChannelListItem[] = [
  {
    id: '1',
    name: '커플 채널',
    description: '우리만의 특별한 공간',
    memberCount: 2,
    lastMessage: '오늘 날씨가 정말 좋네요!',
    lastMessageTime: '2시간 전',
    unreadCount: 3,
  },
  {
    id: '2',
    name: '가족 채널',
    description: '가족들과의 소통 공간',
    memberCount: 4,
    lastMessage: '주말에 뭐 할까요?',
    lastMessageTime: '1일 전',
    unreadCount: 0,
  },
  {
    id: '3',
    name: '친구 채널',
    description: '친구들과의 대화 공간',
    memberCount: 6,
    lastMessage: '다음 주에 만나자!',
    lastMessageTime: '3시간 전',
    unreadCount: 1,
  },
  {
    id: '4',
    name: '업무 채널',
    description: '업무 관련 소통 공간',
    memberCount: 8,
    lastMessage: '회의 일정 확인해주세요',
    lastMessageTime: '30분 전',
    unreadCount: 5,
  },
];

// 통계 데이터 계산 함수
export const calculateChannelStats = (
  channels: ChannelListItem[]
): ChannelStats => {
  const totalChannels = channels.length;
  const activeChannels = channels.filter(
    c => c.lastMessageTime && c.lastMessageTime.includes('시간')
  ).length;
  const totalMessages =
    channels.reduce((sum, c) => sum + (c.unreadCount || 0), 0) + 45;
  const unreadMessages = channels.reduce(
    (sum, c) => sum + (c.unreadCount || 0),
    0
  );
  const memberCount = channels.reduce((sum, c) => sum + c.memberCount, 0);

  return {
    totalChannels,
    activeChannels,
    totalMessages,
    unreadMessages,
    averageResponseTime: '2분',
    memberCount,
  };
};

// 초기 통계 데이터
export const INITIAL_CHANNEL_STATS: ChannelStats = {
  totalChannels: 0,
  activeChannels: 0,
  totalMessages: 0,
  unreadMessages: 0,
  averageResponseTime: '2분',
  memberCount: 0,
};
