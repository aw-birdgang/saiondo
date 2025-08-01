import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button, TextArea, IconButton } from "../common";

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  loading = false, 
  disabled = false, 
  className = "" 
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState("");

  const handleSendMessage = () => {
    if (!inputText.trim() || loading || disabled) return;

    onSendMessage(inputText);
    setInputText("");
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    // TODO: 파일 첨부 기능 구현
    console.log("Attach file clicked");
  };

  const handleEmoji = () => {
    // TODO: 이모지 선택 기능 구현
    console.log("Emoji clicked");
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className="flex items-end space-x-4">
        <div className="flex-1">
          <textarea
            name="message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.input_placeholder") || "메시지를 입력하세요..."}
            rows={1}
            maxLength={1000}
            disabled={loading || disabled}
            className="input min-h-[48px] max-h-32 resize-none text-base"
          />
        </div>
        
        <div className="flex items-center space-x-3">
          <button
            onClick={handleEmoji}
            disabled={loading || disabled}
            title={t("chat.emoji") || "이모지"}
            className="p-3 text-text-secondary hover:text-text hover:bg-secondary rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
          
          <button
            onClick={handleAttachFile}
            disabled={loading || disabled}
            title={t("chat.attach_file") || "파일 첨부"}
            className="p-3 text-text-secondary hover:text-text hover:bg-secondary rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a2 2 0 000-2.828z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10l4 4m0-4l-4 4" />
            </svg>
          </button>
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading || disabled}
            loading={loading}
            size="sm"
            className="px-6 py-3 font-semibold"
          >
            {t("chat.send") || "전송"}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 