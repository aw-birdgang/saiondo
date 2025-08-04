import React from 'react';
import { LoadingState } from '../../components/common';
import { PageLayout } from '../../components/specific';
import {
  ChannelHeader,
  ChannelStats,
  ChannelList
} from '../../components/specific';
import { ChannelContainer } from '../../components/specific/channel';
import { useChannelData } from './hooks/useChannelData';

const ChannelTab: React.FC = () => {
  const {
    // 상태
    channels,
    stats,
    isLoading,
    error,

    // 액션
    handleChannelClick,
    handleCreateChannel,
    handleDeleteChannel,
    handleSearchChannels
  } = useChannelData();

  if (isLoading) {
    return <LoadingState />;
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500">오류가 발생했습니다: {error}</p>
      </div>
    );
  }

  return (
    <PageLayout>
      <ChannelContainer>
        {/* Header */}
        <ChannelHeader onCreateChannel={handleCreateChannel} />

        {/* Channel Stats */}
        <ChannelStats stats={stats} />

        {/* Channels List */}
        <ChannelList
          channels={channels}
          onChannelClick={handleChannelClick}
          onCreateChannel={handleCreateChannel}
        />
      </ChannelContainer>
    </PageLayout>
  );
};

export default ChannelTab;
