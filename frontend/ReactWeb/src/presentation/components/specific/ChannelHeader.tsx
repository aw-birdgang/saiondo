import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common";
import type { ChannelHeaderProps } from "../../pages/channel/types/channelTypes";

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ 
  onCreateChannel, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mb-8 ${className}`}>
      <h2 className="text-2xl font-bold text-txt mb-3 leading-tight">
        {t('channels.my_channels') || '내 채널'}
      </h2>
      <p className="text-txt-secondary mb-6 leading-relaxed">
        {t('channels.channel_description') || '나만의 대화 채널을 만들어보세요'}
      </p>
      
      <Button
        variant="primary"
        fullWidth
        onClick={onCreateChannel}
        leftIcon="➕"
      >
        {t('channels.create_new_channel') || '새 채널 만들기'}
      </Button>
    </div>
  );
};

export default ChannelHeader; 