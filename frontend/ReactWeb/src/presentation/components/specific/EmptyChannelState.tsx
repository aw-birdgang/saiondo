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
      title={t('no_channels')}
      description={t('no_channels_description')}
      action={
        <Button
          variant="primary"
          onClick={onCreateChannel}
        >
          {t('create_first_channel')}
        </Button>
      }
      className={className}
    />
  );
};

export default EmptyChannelState; 