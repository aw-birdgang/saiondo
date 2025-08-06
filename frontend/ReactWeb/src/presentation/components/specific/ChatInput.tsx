import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '@/presentation/components/common';
import { toast } from 'react-hot-toast';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onSendFile?: (file: File) => void;
  loading?: boolean;
  disabled?: boolean;
  className?: string;
}

interface Emoji {
  emoji: string;
  name: string;
}

const COMMON_EMOJIS: Emoji[] = [
  { emoji: '😊', name: 'smile' },
  { emoji: '😂', name: 'joy' },
  { emoji: '❤️', name: 'heart' },
  { emoji: '👍', name: 'thumbs_up' },
  { emoji: '🎉', name: 'party' },
  { emoji: '🔥', name: 'fire' },
  { emoji: '😍', name: 'heart_eyes' },
  { emoji: '🤔', name: 'thinking' },
  { emoji: '👏', name: 'clap' },
  { emoji: '🙏', name: 'pray' },
  { emoji: '😭', name: 'sob' },
  { emoji: '😎', name: 'sunglasses' },
  { emoji: '🤗', name: 'hug' },
  { emoji: '😴', name: 'sleep' },
  { emoji: '🤯', name: 'mind_blown' },
  { emoji: '🥳', name: 'celebration' },
];

const ChatInput: React.FC<ChatInputProps> = ({
  onSendMessage,
  onSendFile,
  loading = false,
  disabled = false,
  className = '',
}) => {
  const { t } = useTranslation();
  const [inputText, setInputText] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSendMessage = () => {
    if (!inputText.trim() || loading || disabled) return;

    onSendMessage(inputText);
    setInputText('');
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleAttachFile = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 크기 제한 (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      toast.error(
        t('chat.file_too_large') || '파일 크기는 10MB 이하여야 합니다.'
      );
      return;
    }

    // 허용된 파일 타입
    const allowedTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'application/pdf',
      'text/plain',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error(
        t('chat.file_type_not_supported') || '지원하지 않는 파일 형식입니다.'
      );
      return;
    }

    if (onSendFile) {
      onSendFile(file);
      toast.success(t('chat.file_attached') || '파일이 첨부되었습니다.');
    } else {
      toast.error(
        t('chat.file_upload_not_supported') ||
          '파일 업로드가 지원되지 않습니다.'
      );
    }

    // 파일 입력 초기화
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleEmoji = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiSelect = (emoji: string) => {
    setInputText(prev => prev + emoji);
    setShowEmojiPicker(false);
  };

  const handleClickOutside = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setShowEmojiPicker(false);
    }
  };

  return (
    <div className={`card p-6 ${className}`}>
      <div className='flex items-end space-x-4'>
        <div className='flex-1 relative'>
          <textarea
            name='message'
            value={inputText}
            onChange={e => setInputText(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              t('chat.input_placeholder') || '메시지를 입력하세요...'
            }
            rows={1}
            maxLength={1000}
            disabled={loading || disabled}
            className='input min-h-[48px] max-h-32 resize-none text-base'
          />

          {/* 이모지 선택기 */}
          {showEmojiPicker && (
            <div
              className='absolute bottom-full left-0 mb-2 bg-surface border border-divider rounded-lg shadow-lg p-3 z-50'
              onClick={handleClickOutside}
            >
              <div className='grid grid-cols-8 gap-2 max-w-64'>
                {COMMON_EMOJIS.map((emojiData, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emojiData.emoji)}
                    className='p-2 hover:bg-secondary rounded-lg transition-colors duration-200 text-lg'
                    title={emojiData.name}
                  >
                    {emojiData.emoji}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className='flex items-center space-x-3'>
          <button
            onClick={handleEmoji}
            disabled={loading || disabled}
            title={t('chat.emoji') || '이모지'}
            className={`p-3 text-txt-secondary hover:text-txt hover:bg-secondary rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105 ${
              showEmojiPicker ? 'bg-secondary text-txt' : ''
            }`}
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
              />
            </svg>
          </button>

          <button
            onClick={handleAttachFile}
            disabled={loading || disabled}
            title={t('chat.attach_file') || '파일 첨부'}
            className='p-3 text-txt-secondary hover:text-txt hover:bg-secondary rounded-lg transition-all duration-200 disabled:opacity-50 hover:scale-105'
          >
            <svg
              className='w-5 h-5'
              fill='none'
              stroke='currentColor'
              viewBox='0 0 24 24'
            >
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M15.172 7l-6.586 6.586a2 2 0 102.828 2.828L18 9.828a2 2 0 000-2.828z'
              />
              <path
                strokeLinecap='round'
                strokeLinejoin='round'
                strokeWidth={2}
                d='M10 10l4 4m0-4l-4 4'
              />
            </svg>
          </button>

          {/* 숨겨진 파일 입력 */}
          <input
            ref={fileInputRef}
            type='file'
            onChange={handleFileChange}
            className='hidden'
            accept='image/*,.pdf,.txt,.doc,.docx'
          />

          <Button
            onClick={handleSendMessage}
            disabled={!inputText.trim() || loading || disabled}
            loading={loading}
            size='sm'
            className='px-6 py-3 font-semibold'
          >
            {t('chat.send') || '전송'}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
