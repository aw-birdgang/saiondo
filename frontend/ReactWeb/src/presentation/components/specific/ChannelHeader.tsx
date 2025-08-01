import React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../common";

interface ChannelHeaderProps {
  onCreateChannel: () => void;
  className?: string;
}

const ChannelHeader: React.FC<ChannelHeaderProps> = ({ 
  onCreateChannel, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <div className={`mb-6 ${className}`}>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
        {t('my_channels')}
      </h2>
      <p className="text-gray-600 dark:text-gray-400 mb-4">
        {t('channel_description')}
      </p>
      
      <Button
        variant="primary"
        fullWidth
        onClick={onCreateChannel}
        icon="➕"
      >
        {t('create_new_channel')}
      </Button>
    </div>
  );
};

export default ChannelHeader; 