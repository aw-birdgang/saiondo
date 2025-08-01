import React from "react";
import { useTranslation } from "react-i18next";
import { Header } from "../common";

interface ChatHeaderProps {
  channelId: string;
  backRoute: string;
  className?: string;
}

const ChatHeader: React.FC<ChatHeaderProps> = ({ 
  channelId, 
  backRoute, 
  className = "" 
}) => {
  const { t } = useTranslation();

  return (
    <Header
      title={t("chat.title")}
      showBackButton
      backRoute={backRoute}
      className={`max-w-4xl mx-auto ${className}`}
    >
      <div className="text-sm text-gray-500">
        Channel: {channelId}
      </div>
    </Header>
  );
};

export default ChatHeader; 