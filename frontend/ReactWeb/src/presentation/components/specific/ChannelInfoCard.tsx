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
    <div className={`space-y-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
        {t("channel_info") || "채널 정보"}
      </h3>
      
      <div className="grid grid-cols-1 gap-4">
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