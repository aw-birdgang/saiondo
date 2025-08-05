import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataLoader } from '../../../hooks/useDataLoader';
import { ROUTES } from '../../../../shared/constants/app';
import { MOCK_CHANNELS, calculateChannelStats, INITIAL_CHANNEL_STATS } from '../constants/channelData';
import type { ChannelPageState } from '../types/channelTypes';

export const useChannelData = () => {
  const navigate = useNavigate();
  
  const [state, setState] = useState<ChannelPageState>({
    channels: [],
    stats: INITIAL_CHANNEL_STATS,
    isLoading: false,
    error: null
  });

  // 데이터 로딩
  const { loading: isLoading } = useDataLoader(
    async () => {
      // TODO: 실제 API 호출로 대체
      // const response = await channelService.getChannels();
      // return response.data;

      // Mock 데이터 로딩 시뮬레이션
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const channels = MOCK_CHANNELS;
      const stats = calculateChannelStats(channels);
      
      setState(prev => ({
        ...prev,
        channels,
        stats
      }));
    },
    [],
    { 
      autoLoad: true,
      errorMessage: '채널을 불러오는데 실패했습니다.'
    }
  );

  // 채널 클릭 처리
  const handleChannelClick = useCallback((channelId: string) => {
    navigate(`${ROUTES.CHAT}/${channelId}`);
  }, [navigate]);

  // 새 채널 생성 처리
  const handleCreateChannel = useCallback(() => {
    navigate(ROUTES.CHANNELS);
  }, [navigate]);

  // 채널 삭제 처리 (향후 확장용)
  const handleDeleteChannel = useCallback((channelId: string) => {
    setState(prev => ({
      ...prev,
      channels: prev.channels.filter(channel => channel.id !== channelId),
      stats: calculateChannelStats(prev.channels.filter(channel => channel.id !== channelId))
    }));
  }, []);

  // 채널 검색 처리 (향후 확장용)
  const handleSearchChannels = useCallback((searchTerm: string) => {
    if (!searchTerm.trim()) {
      setState(prev => ({
        ...prev,
        channels: MOCK_CHANNELS,
        stats: calculateChannelStats(MOCK_CHANNELS)
      }));
      return;
    }

    const filteredChannels = MOCK_CHANNELS.filter(channel =>
      channel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      channel.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    setState(prev => ({
      ...prev,
      channels: filteredChannels,
      stats: calculateChannelStats(filteredChannels)
    }));
  }, []);

  return {
    // 상태
    channels: state.channels,
    stats: state.stats,
    isLoading,
    error: state.error,

    // 액션
    handleChannelClick,
    handleCreateChannel,
    handleDeleteChannel,
    handleSearchChannels,

    // 유틸리티
    refreshData: () => {
      setState(prev => ({
        ...prev,
        channels: MOCK_CHANNELS,
        stats: calculateChannelStats(MOCK_CHANNELS)
      }));
    }
  };
}; 