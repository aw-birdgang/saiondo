import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../../shared/constants/app";
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { useMessages } from "../../hooks/useMessages";
import {
  ChatHeader,
  ChatContainer,
  ChatContent,
  AuthRequired
} from "../../components/specific";


const ChatPage: React.FC = () => {

  const params = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();
  
  const [inputText, setInputText] = useState("");

  // Extract parameters from URL or location state
  const channelId = params.channelId || location.state?.channelId || 'default-channel';

  // Use messages hook
  const {
    messages,
    loading,
    error,
    sendMessage,
  } = useMessages(channelId);



  // Handle error
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || loading) return;

    try {
      await sendMessage({
        content: inputText,
        type: 'text',
        channelId,
        senderId: user?.id || currentUser?.id || '',
      });
      setInputText("");
    } catch (error) {
      console.error("Failed to send message:", error);
      toast.error("메시지 전송에 실패했습니다.");
    }
  };



  if (!user && !currentUser) {
    return <AuthRequired loginRoute={ROUTES.LOGIN} />;
  }

  return (
    <ChatContainer>
      {/* Header */}
      <ChatHeader 
        channelId={channelId}
        backRoute={ROUTES.HOME}
      />

      {/* Chat Content */}
      <ChatContent
        messages={messages}
        loading={loading}
        currentUserId={user?.id || currentUser?.id || ''}
        onSendMessage={handleSendMessage}
      />
    </ChatContainer>
  );
};

export default ChatPage;
