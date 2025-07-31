import React, { useState, useEffect, useRef, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { toast } from "react-hot-toast";
import { ROUTES } from "../../constants";
import { useUserStore } from "../../core/stores/userStore";
import { useAuthStore } from "../../core/stores/authStore";

interface Message {
  id: string;
  text: string;
  sender: "user" | "assistant";
  timestamp: Date;
  userId?: string;
  assistantId?: string;
  channelId?: string;
}

interface ChatState {
  messages: Message[];
  isConnected: boolean;
  isAwaitingLLM: boolean;
  errorMessage: string | null;
}

const ChatScreen: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const params = useParams();
  const location = useLocation();
  const { selectedUser, setAssistantId, setChannelId } = useUserStore();
  const { userId } = useAuthStore();
  
  // Chat state
  const [chatState, setChatState] = useState<ChatState>({
    messages: [],
    isConnected: false,
    isAwaitingLLM: false,
    errorMessage: null,
  });
  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Extract parameters from URL or location state
  const channelId = params.channelId || location.state?.channelId;
  const assistantId = params.assistantId || location.state?.assistantId;

  // Update store with URL parameters
  useEffect(() => {
    if (channelId) {
      setChannelId(channelId);
    }
    if (assistantId) {
      setAssistantId(assistantId);
    }
  }, [channelId, assistantId, setChannelId, setAssistantId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatState.messages]);

  // Load initial messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        // TODO: Implement actual API call
        const initialMessages: Message[] = [
          {
            id: "1",
            text: t("ai_advice_description"),
            sender: "assistant",
            timestamp: new Date(),
            userId: userId || "",
            assistantId: assistantId || "",
            channelId: channelId || "",
          },
        ];
        setChatState(prev => ({ ...prev, messages: initialMessages }));
      } catch (error) {
        console.error("Failed to load messages:", error);
        toast.error(t("chat_connected"));
      }
    };

    if (assistantId) {
      loadMessages();
    }
  }, [assistantId, userId, channelId, t]);

  const handleSendMessage = async () => {
    if (!inputText.trim() || chatState.isAwaitingLLM) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
      userId: userId || "",
      assistantId: assistantId || "",
      channelId: channelId || "",
    };

    setChatState((prev) => ({ 
      ...prev, 
      messages: [...prev.messages, userMessage],
      isAwaitingLLM: true 
    }));
    setInputText("");

    try {
      // TODO: Implement actual API call
      setTimeout(() => {
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          text: "메시지를 받았습니다. 곧 답변드리겠습니다.",
          sender: "assistant",
          timestamp: new Date(),
          userId: userId || "",
          assistantId: assistantId || "",
          channelId: channelId || "",
        };
        setChatState((prev) => ({ 
          ...prev, 
          messages: [...prev.messages, assistantMessage],
          isAwaitingLLM: false 
        }));
      }, 1000);
    } catch (error) {
      console.error("Failed to send message:", error);
      setChatState((prev) => ({ 
        ...prev, 
        isAwaitingLLM: false,
        errorMessage: "메시지 전송에 실패했습니다." 
      }));
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

  // Error handling
  useEffect(() => {
    if (chatState.errorMessage) {
      toast.error(chatState.errorMessage);
      setChatState(prev => ({ ...prev, errorMessage: null }));
    }
  }, [chatState.errorMessage]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate(ROUTES.HOME)}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
              >
                <span className="text-xl">←</span>
              </button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {t("chat.title")}
                </h1>
                <p className="text-sm text-gray-500">
                  AI 상담사와 대화하세요
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white text-sm">AI</span>
              </div>
              <span className="text-sm text-gray-600">온라인</span>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="max-w-4xl mx-auto px-4 py-4">
        <div className="bg-white rounded-lg shadow-sm h-[calc(100vh-200px)] flex flex-col">
          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {chatState.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${
                  message.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                    message.sender === "user"
                      ? "bg-primary text-white"
                      : "bg-gray-100 text-gray-900"
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === "user"
                        ? "text-white/70"
                        : "text-gray-500"
                    }`}
                  >
                    {formatTime(message.timestamp)}
                  </p>
                </div>
              </div>
            ))}
            
            {chatState.isAwaitingLLM && (
              <div className="flex justify-start">
                <div className="bg-gray-100 text-gray-900 px-4 py-2 rounded-lg">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.1s" }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }}></div>
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <div className="flex-1">
                <textarea
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder={t("chat.typeMessage")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows={1}
                  disabled={chatState.isAwaitingLLM}
                />
              </div>
              <button
                onClick={handleSendMessage}
                disabled={!inputText.trim() || chatState.isAwaitingLLM}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  !inputText.trim() || chatState.isAwaitingLLM
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-primary text-white hover:bg-primaryContainer"
                }`}
              >
                {t("chat.sendMessage")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatScreen;
