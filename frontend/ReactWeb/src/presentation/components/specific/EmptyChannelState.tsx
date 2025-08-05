import React from "react";
import { useTranslation } from "react-i18next";
import { EmptyState, Button } from "../common";

interface EmptyChannelStateProps {
  onCreateChannel: () => void;
  className?: string;
}

const EmptyChannelState: React.FC<EmptyChannelStateProps> = ({ 
  onCreateChannel, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <EmptyState
      icon={
        <div className="text-6xl">👥</div>
      }
      title={t('channels.no_channels') || '채널이 없습니다'}
      description={t('channels.no_channels_description') || '첫 번째 채널을 만들어보세요!'}
      action={
        <Button
          variant="primary"
          onClick={onCreateChannel}
        >
          {t('channels.create_first_channel') || '첫 번째 채널 만들기'}
        </Button>
      }
      className={className}
    />
  );
};

export default EmptyChannelState; 