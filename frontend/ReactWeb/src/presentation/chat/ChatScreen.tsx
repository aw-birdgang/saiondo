import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../constants";
import { useUserStore } from "../../applicati../../application/stores/userStore";
import { useAuthStore } from "../../applicati../../application/stores/authStore";
import { useSocket } from "../../presentati../../presentation/hooks/useSocket";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  userId?: string;
  assistantId?: string;
  channelId?: string;
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { selectedUser, setAssistantId, setChannelId } = useUserStore();
  const { userId } = useAuthStore();
  
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract parameters from URL or location state
  const channelId = params.channelId || location.state?.channelId || '';
  const assistantId = params.assistantId || location.state?.assistantId || '';

  // Socket connection
  const {
    isConnected,
    isConnecting,
    error: socketError,
    messages: socketMessages,
    isAwaitingLLM,
    connect: connectSocket,
    disconnect: disconnectSocket,
    sendMessage: sendSocketMessage,
    reconnect: reconnectSocket,
  } = useSocket({
    userId,
    assistantId,
    channelId,
    autoConnect: false,
  });

  // Update store with URL parameters
  useEffect(() => {
    if (channelId) {
      setChannelId(channelId);
    }
    if (assistantId) {
      setAssistantId(assistantId);
    }
  }, [channelId, assistantId, setChannelId, setAssistantId]);

  // Connect to socket when parameters are available
  useEffect(() => {
    if (userId && assistantId && channelId) {
      connectSocket(userId, assistantId, channelId);
    }
  }, [userId, assistantId, channelId, connectSocket]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      disconnectSocket();
    };
  }, [disconnectSocket]);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [socketMessages, scrollToBottom]);

  // Handle socket error
  useEffect(() => {
    if (socketError) {
      toast.error(socketError);
    }
  }, [socketError]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || isAwaitingLLM) return;

    try {
      sendSocketMessage(inputText);
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
    return date.toLocaleTimeString("ko-KR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // Convert socket messages to display format
  const displayMessages: Message[] = socketMessages.map(msg => ({
    id: msg.id,
    text: msg.message,
    sender: msg.sender === 'USER' ? 'user' : 'assistant',
    timestamp: msg.createdAt,
    userId: msg.userId,
    assistantId: msg.assistantId,
    channelId: msg.channelId,
  }));

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-dark-surface">
      {/* Header */}
      <div className="bg-white dark:bg-dark-secondary-container shadow-sm border-b dark:border-dark-border">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="p-2 hover:bg-gray-100 dark:hover:bg-dark-secondary rounded-full transition-colors text-gray-700 dark:text-white"
            >
              <span className="text-xl">←</span>
            </button>
            <div>
              <h1 className="text-xl font-semibold text-gray-900 dark:text-white">
                {t("chat.title")}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                AI 상담사와 대화하세요
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  isConnected ? "bg-green-500" : "bg-gray-400"
                }`}
              >
                <span className="text-white text-sm">AI</span>
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {isConnected ? t("chat_connected") : t("chat_disconnected")}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="bg-white dark:bg-dark-secondary-container rounded-lg shadow-sm h-96 overflow-y-auto p-4">
          {isConnecting && (
            <div className="text-center py-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">연결 중...</p>
            </div>
          )}

          {!isConnecting && displayMessages.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">
                {t("chat.start_conversation")}
              </p>
            </div>
          )}

          {displayMessages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 flex ${
                message.sender === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.sender === "user"
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 dark:bg-dark-surface text-gray-900 dark:text-white"
                }`}
              >
                <p className="text-sm">{message.text}</p>
                <p
                  className={`text-xs mt-1 ${
                    message.sender === "user"
                      ? "text-blue-100"
                      : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {formatTime(message.timestamp)}
                </p>
              </div>
            </div>
          ))}

          {isAwaitingLLM && (
            <div className="flex justify-start mb-4">
              <div className="bg-gray-200 dark:bg-dark-surface rounded-lg px-4 py-2">
                <div className="flex items-center space-x-2">
                  <div className="animate-pulse">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                  <div className="animate-pulse">
                    <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="mt-4 flex space-x-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.input_placeholder")}
            disabled={!isConnected || isAwaitingLLM}
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-dark-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-dark-secondary-container dark:text-white disabled:opacity-50"
          />
          <button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || !isConnected || isAwaitingLLM}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t("chat.send")}
          </button>
        </div>

        {/* Connection Status */}
        {!isConnected && !isConnecting && (
          <div className="mt-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <div className="flex items-center justify-between">
              <p className="text-sm text-yellow-800 dark:text-yellow-200">
                연결이 끊어졌습니다.
              </p>
              <button
                onClick={reconnectSocket}
                className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600"
              >
                재연결
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatScreen;
