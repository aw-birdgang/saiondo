import React from 'react';
import {HomeDashboard} from "@/presentation/components/specific";

const HomeTab: React.FC = () => {
  return (
    <HomeDashboard
      stats={{
        totalChats: 12,
        activeChannels: 3,
        unreadMessages: 5,
        lastActivity: '2시간 전',
      }}
    />
  );
};

export default HomeTab;
