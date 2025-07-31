import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ROUTES } from '../../constants';
import { useAuthStore } from '../../core/stores/authStore';

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
  const { userId } = useAuthStore();
  
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
    navigate(ROUTES.INVITE_PARTNER);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-dark-surface flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
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
          <button
            onClick={handleCreateChannel}
            className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition-colors flex items-center justify-center"
          >
            <span className="mr-2">➕</span>
            {t('create_new_channel')}
          </button>
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
              <button
                onClick={handleCreateChannel}
                className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
              >
                {t('create_first_channel')}
              </button>
            </div>
          ) : (
            channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => handleChannelClick(channel.id)}
                className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm border border-gray-200 dark:border-dark-border p-4 hover:shadow-md transition-shadow cursor-pointer"
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {channel.name}
                      </h3>
                      {channel.unreadCount > 0 && (
                        <span className="ml-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                          {channel.unreadCount}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                      {channel.description}
                    </p>
                    <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                      <span className="mr-4">
                        👥 {channel.memberCount} {t('members')}
                      </span>
                      {channel.lastMessage && (
                        <>
                          <span className="mr-4">
                            💬 {channel.lastMessage}
                          </span>
                          <span>{channel.lastMessageTime}</span>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="ml-4">
                    <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ChannelTab; 