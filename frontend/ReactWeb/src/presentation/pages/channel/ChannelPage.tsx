import React, {useEffect, useState} from 'react';

import {useNavigate} from 'react-router-dom';
import {ROUTES} from "../../../shared/constants/app";
import {ChannelHeader, ChannelList, ChannelStats, LoadingState, PageLayout} from '../../components/specific';
import type {ChannelListItem, ChannelStats as ChannelStatsType} from '../../../domain/types';

const ChannelTab: React.FC = () => {

  const navigate = useNavigate();

  const [channels, setChannels] = useState<ChannelListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<ChannelStatsType>({
    totalChannels: 0,
    activeChannels: 0,
    totalMessages: 0,
    unreadMessages: 0,
    averageResponseTime: '2분',
    memberCount: 0
  });

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    const mockChannels: ChannelListItem[] = [
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
    ];

    setTimeout(() => {
      setChannels(mockChannels);
      setStats({
        totalChannels: mockChannels.length,
        activeChannels: mockChannels.filter(c => c.lastMessageTime && c.lastMessageTime.includes('시간')).length,
        totalMessages: mockChannels.reduce((sum, c) => sum + (c.unreadCount || 0), 0) + 45,
        unreadMessages: mockChannels.reduce((sum, c) => sum + (c.unreadCount || 0), 0),
        averageResponseTime: '2분',
        memberCount: mockChannels.reduce((sum, c) => sum + c.memberCount, 0)
      });
      setIsLoading(false);
    }, 1000);
  }, []);

  const handleChannelClick = (channelId: string) => {
    navigate(`${ROUTES.CHAT}/${channelId}`);
  };

  const handleCreateChannel = () => {
    navigate(ROUTES.CHANNELS);
  };

  if (isLoading) {
    return <LoadingState />;
  }

  return (
    <PageLayout>
      {/* Header */}
      <ChannelHeader onCreateChannel={handleCreateChannel} />

      {/* Channel Stats */}
      <ChannelStats stats={stats} className="mb-6" />

      {/* Channels List */}
      <ChannelList
        channels={channels}
        onChannelClick={handleChannelClick}
        onCreateChannel={handleCreateChannel}
      />
    </PageLayout>
  );
};

export default ChannelTab;
