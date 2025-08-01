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
    <div className={`bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg p-3 ${className}`}>
      <div className="flex items-end space-x-2">
        <div className="flex-1">
          <TextArea
            name="message"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={t("chat.input_placeholder")}
            rows={1}
            maxLength={1000}
            disabled={loading || disabled}
            className="min-h-[40px] max-h-32"
          />
        </div>
        
        <div className="flex items-center space-x-1">
          <IconButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
            onClick={handleEmoji}
            variant="ghost"
            size="sm"
            disabled={loading || disabled}
            title={t("chat.emoji")}
          />
          
          <IconButton
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a2 2 0 000-2.828z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 10l4 4m0-4l-4 4" />
              </svg>
            }
            onClick={handleAttachFile}
            variant="ghost"
            size="sm"
            disabled={loading || disabled}
            title={t("chat.attach_file")}
          />
          
          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading || disabled}
            loading={loading}
            size="sm"
          >
            {t("chat.send")}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 