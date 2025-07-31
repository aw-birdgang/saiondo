import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../../shared/constants/app";
import { useAuth } from "../../../contexts/AuthContext";
import { useAuthStore } from '../../../stores/authStore';
import { useUserStore } from '../../../stores/userStore';
import { useMessages } from "../../hooks/useMessages";
import { Header, Button, MessageBubble } from "../../components/common";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  userId?: string;
  assistantId?: string;
  channelId?: string;
}

const ChatPage: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { user } = useAuthStore();
  const { currentUser } = useUserStore();
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract parameters from URL or location state
  const channelId = params.channelId || location.state?.channelId || 'default-channel';
  const assistantId = params.assistantId || location.state?.assistantId || 'default-assistant';

  // Use messages hook
  const {
    messages,
    loading,
    error,
    sendMessage,
  } = useMessages(channelId);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

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

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('ko-KR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  if (!user && !currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">{t("auth.login_required")}</h2>
          <button
            onClick={() => navigate(ROUTES.LOGIN)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            {t("auth.login")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <Header
        title={t("chat.title")}
        showBackButton
        backRoute={ROUTES.HOME}
        className="max-w-4xl mx-auto"
      >
        <div className="text-sm text-gray-500">
          Channel: {channelId}
        </div>
      </Header>

      {/* Chat Messages */}
      <div className="flex-1 max-w-4xl mx-auto w-full px-4 py-6">
        <div className="bg-white rounded-lg shadow-sm h-96 overflow-y-auto p-4">
          {loading && messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-gray-500">{t("common.loading")}</div>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-gray-500">
                <p>{t("chat.no_messages")}</p>
                <p className="text-sm mt-2">{t("chat.start_conversation")}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {messages.map((message) => (
                <MessageBubble
                  key={message.id}
                  content={message.content}
                  timestamp={new Date(message.createdAt)}
                  isOwnMessage={message.senderId === (user?.id || currentUser?.id)}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.input_placeholder")}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading}
            loading={loading}
          >
            {t("chat.send")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatPage;
