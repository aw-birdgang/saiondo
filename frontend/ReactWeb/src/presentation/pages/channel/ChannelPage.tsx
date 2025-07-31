import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from "../../../shared/constants/app";
import { Button, ChannelCard, LoadingSpinner } from '../../components/common';
// import { useAuthStore } from '../../applicati../../application/stores/authStore'; // TODO: 사용 예정

interface Channel {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  lastMessage?: string;
  lastMessageTime?: string;
  unreadCount: number;
}

const ChannelTab: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  // const { userId } = useAuthStore(); // TODO: 사용 예정

  const [channels, setChannels] = useState<Channel[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: 실제 API 호출로 대체
    const mockChannels: Channel[] = [
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
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            {t('my_channels')}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {t('channel_description')}
          </p>
        </div>

        {/* Create Channel Button */}
        <div className="mb-6">
          <Button
            variant="primary"
            fullWidth
            onClick={handleCreateChannel}
            icon="➕"
          >
            {t('create_new_channel')}
          </Button>
        </div>

        {/* Channels List */}
        <div className="space-y-4">
          {channels.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">👥</div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {t('no_channels')}
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {t('no_channels_description')}
              </p>
              <Button
                variant="primary"
                onClick={handleCreateChannel}
              >
                {t('create_first_channel')}
              </Button>
            </div>
          ) : (
            channels.map((channel) => (
              <ChannelCard
                key={channel.id}
                channel={channel}
                onClick={handleChannelClick}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelTab;
