import React, { useState, useRef } from 'react';
import { useMessageController } from '../../providers/ControllerProvider';
import { toast } from 'react-hot-toast';

interface ChatMessageInputProps {
  channelId: string;
  userId: string;
  onMessageSent?: (message: any) => void;
}

export const ChatMessageInput: React.FC<ChatMessageInputProps> = ({
  channelId,
  userId,
  onMessageSent
}) => {
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const messageController = useMessageController();

  const handleSendMessage = async () => {
    if (!message.trim() || isSending) return;

    setIsSending(true);
    
    try {
      const sentMessage = await messageController.executeWithTracking(
        'sendMessage',
        { channelId, senderId: userId, content: message.trim(), type: 'text' },
        async () => {
          // 실제 메시지 전송 로직 시뮬레이션
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

    setIsSending(true);
    
    try {
      const result = await messageController.executeWithTracking(
        'uploadFile',
        { channelId, senderId: userId, file, description: `파일 업로드: ${file.name}` },
        async () => {
          // 실제 파일 업로드 로직 시뮬레이션
          await new Promise(resolve => setTimeout(resolve, 1000));
          return {
            message: {
              id: Date.now().toString(),
              content: `파일: ${file.name}`,
              senderId: userId,
              timestamp: new Date(),
              type: 'file' as const,
              metadata: { fileName: file.name, fileSize: file.size }
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

  return (
    <div className="flex items-center gap-2 p-4 border-t bg-white dark:bg-gray-800">
      {/* 파일 업로드 버튼 */}
      <button
        onClick={() => fileInputRef.current?.click()}
        disabled={isSending}
        className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50"
        title="파일 첨부"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
        </svg>
      </button>

      {/* 파일 입력 (숨김) */}
      <input
        ref={fileInputRef}
        type="file"
        onChange={handleFileUpload}
        className="hidden"
        accept="image/*,.pdf,.doc,.docx,.txt"
      />

      {/* 메시지 입력 */}
      <div className="flex-1">
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="메시지를 입력하세요..."
          disabled={isSending}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white disabled:opacity-50"
          rows={1}
          style={{ minHeight: '40px', maxHeight: '120px' }}
        />
      </div>

      {/* 전송 버튼 */}
      <button
        onClick={handleSendMessage}
        disabled={!message.trim() || isSending}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSending ? (
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            전송중...
          </div>
        ) : (
          '전송'
        )}
      </button>
    </div>
  );
}; 