import React, { useState, useRef, useEffect } from 'react';
import { useMessageController } from '../../providers/ControllerProvider';
import { Button, LoadingSpinner } from '../common';
import { useToastContext } from '../../providers/ToastProvider';
import { cn } from '../../../utils/cn';

interface ChatMessageInputProps {
  channelId: string;
  userId: string;
  onMessageSent?: (message: any) => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  channelId,
  userId,
  onMessageSent,
  onTyping,
  onStopTyping
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const messageController = useMessageController();
  const toast = useToastContext();

  // 타이핑 상태 관리
  useEffect(() => {
    let typingTimer: NodeJS.Timeout;
    
    if (message.trim() && !isTyping) {
      setIsTyping(true);
      onTyping?.();
    } else if (!message.trim() && isTyping) {
      setIsTyping(false);
      onStopTyping?.();
    }

    if (message.trim()) {
      typingTimer = setTimeout(() => {
        setIsTyping(false);
        onStopTyping?.();
      }, 2000);
    }

    return () => {
      if (typingTimer) {
        clearTimeout(typingTimer);
      }
    };
  }, [message, isTyping, onTyping, onStopTyping]);

  // 자동 높이 조정
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [message]);

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    
    try {
      const sentMessage = await messageController.executeWithTracking(
        'sendMessage',
        { channelId, senderId: userId, content: message.trim(), type: 'text' },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 500));
          return {
            id: Date.now().toString(),
            content: message.trim(),
            senderId: userId,
            timestamp: new Date(),
            type: 'text' as const
          };
        }
      );

      setMessage('');
      setIsTyping(false);
      onStopTyping?.();
      onMessageSent?.(sentMessage);
      
      toast.success('메시지가 전송되었습니다.');
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      toast.error('메시지 전송에 실패했습니다.');
    } finally {
      setIsSending(false);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('파일 크기는 10MB 이하여야 합니다.');
      return;
    }

    setIsSending(true);
    
    try {
      const result = await messageController.executeWithTracking(
        'uploadFile',
        { channelId, senderId: userId, file, description: `파일 업로드: ${file.name}` },
        async () => {
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            message: {
              id: Date.now().toString(),
              content: `파일: ${file.name}`,
              senderId: userId,
              timestamp: new Date(),
              type: 'file' as const,
              metadata: { 
                fileName: file.name, 
                fileSize: file.size,
                fileType: file.type 
              }
            }
          };
        }
      );

      onMessageSent?.(result.message);
      toast.success('파일이 업로드되었습니다.');
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      toast.error('파일 업로드에 실패했습니다.');
    } finally {
      setIsSending(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMessage();
    }
  };

  const addEmoji = (emoji: string) => {
    setMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    textareaRef.current?.focus();
  };

  const commonEmojis = ['😊', '👍', '❤️', '😂', '🎉', '🔥', '👏', '🙏', '🤔', '😍'];

  return (
    <div className="border-t border-border bg-surface p-4">
      {/* 이모지 피커 */}
      {showEmojiPicker && (
        <div className="mb-3 p-3 bg-focus rounded-lg border border-border">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-txt">이모지</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowEmojiPicker(false)}
            >
              ✕
            </Button>
          </div>
          <div className="grid grid-cols-10 gap-1">
            {commonEmojis.map((emoji, index) => (
              <button
                key={index}
                onClick={() => addEmoji(emoji)}
                className="w-8 h-8 text-lg hover:bg-primary/10 rounded transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* 파일 업로드 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => fileInputRef.current?.click()}
          disabled={isSending}
          className="p-2"
          title="파일 첨부"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
          </svg>
        </Button>

        {/* 이모지 버튼 */}
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setShowEmojiPicker(!showEmojiPicker)}
          className="p-2"
          title="이모지"
        >
          😊
        </Button>

        {/* 파일 입력 (숨김) */}
        <input
          ref={fileInputRef}
          type="file"
          onChange={handleFileUpload}
          className="hidden"
          accept="image/*,.pdf,.doc,.docx,.txt,.xls,.xlsx,.ppt,.pptx"
        />

        {/* 메시지 입력 */}
        <div className="flex-1 relative">
          <textarea
            ref={textareaRef}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="메시지를 입력하세요... (Enter로 전송, Shift+Enter로 줄바꿈)"
            disabled={isSending}
            className={cn(
              'w-full px-3 py-2 border border-border rounded-lg resize-none',
              'focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent',
              'bg-surface text-txt placeholder:text-txt-secondary',
              'disabled:opacity-50 transition-all duration-200',
              'min-h-[40px] max-h-[120px]'
            )}
            rows={1}
          />
          
          {/* 문자 수 표시 */}
          {message.length > 0 && (
            <div className="absolute bottom-1 right-2 text-xs text-txt-secondary">
              {message.length}/1000
            </div>
          )}
        </div>

        {/* 전송 버튼 */}
        <Button
          onClick={handleSendMessage}
          disabled={!message.trim() || isSending}
          loading={isSending}
          loadingText="전송중..."
          className="px-4 py-2"
        >
          전송
        </Button>
      </div>

      {/* 파일 업로드 가이드 */}
      <div className="mt-2 text-xs text-txt-secondary">
        지원 파일: 이미지, PDF, 문서 (최대 10MB)
      </div>
    </div>
  );
}; 