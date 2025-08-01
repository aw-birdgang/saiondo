import React from "react";
import { useTranslation } from "react-i18next";
import { InfoCard } from "../common";

interface ChannelInfoCardProps {
  ownedChannelsCount: number;
  memberChannelsCount: number;
  className?: string;
}

const ChannelInfoCard: React.FC<ChannelInfoCardProps> = ({ 
  ownedChannelsCount, 
  memberChannelsCount, 
  className = "" 
}) => {
  const { t } = useTranslation();

  const channelStats = [
    {
      title: "내가 만든 채널",
      value: ownedChannelsCount,
      icon: "👑",
      description: "소유하고 있는 채널 수",
      variant: "info" as const
    },
    {
      title: "참여 중인 채널",
      value: memberChannelsCount,
      icon: "👥",
      description: "멤버로 참여 중인 채널 수",
      variant: "default" as const
    },
    {
      title: "총 채널 수",
      value: ownedChannelsCount + memberChannelsCount,
      icon: "📊",
      description: "전체 참여 채널 수",
      variant: "success" as const
    }
  ];

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center space-x-4">
        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
          <span className="text-xl">📺</span>
        </div>
        <h3 className="text-xl font-semibold text-text leading-tight">
          {t("channel_info") || "채널 정보"}
        </h3>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {channelStats.map((stat, index) => (
          <InfoCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            description={stat.description}
            variant={stat.variant}
          />
        ))}
      </div>
    </div>
  );
};

export default ChannelInfoCard; 