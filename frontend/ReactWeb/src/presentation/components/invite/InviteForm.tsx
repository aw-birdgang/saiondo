import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, TextArea } from '../common';
import { cn } from '../../../utils/cn';

interface InviteFormProps {
  partnerEmail: string;
  onEmailChange: (email: string) => void;
  onInvite: (email: string, message?: string) => void;
  isLoading: boolean;
  error: string | null;
  className?: string;
}

export const InviteForm: React.FC<InviteFormProps> = ({
  partnerEmail,
  onEmailChange,
  onInvite,
  isLoading,
  error,
  className
}) => {
  const { t } = useTranslation();
  const [message, setMessage] = useState('');

  const handleInvite = () => {
    const trimmedEmail = partnerEmail.trim();
    const trimmedMessage = message.trim();

    if (!trimmedEmail) {
      return;
    }

    onInvite(trimmedEmail, trimmedMessage || undefined);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleInvite();
    }
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* 아이콘 */}
      <div className="text-center">
        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-txt mb-2">파트너 초대</h2>
        <p className="text-txt-secondary">파트너의 이메일 주소를 입력하여 초대를 보내세요</p>
      </div>

      {/* 이메일 입력 */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-txt">
          파트너 이메일
        </label>
        <Input
          type="email"
          placeholder="partner@example.com"
          value={partnerEmail}
          onChange={(e) => onEmailChange(e.target.value)}
          onKeyPress={handleKeyPress}
          error={error || undefined}
          disabled={isLoading}
          className="w-full"
        />
      </div>

      {/* 메시지 입력 (선택사항) */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-txt">
          초대 메시지 <span className="text-txt-secondary">(선택사항)</span>
        </label>
        <TextArea
          name="message"
          placeholder="함께 대화를 나누어보세요!"
          value={message}
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setMessage(e.target.value)}
          disabled={isLoading}
          maxLength={500}
          rows={3}
          className="w-full"
        />
        <div className="text-xs text-txt-secondary text-right">
          {message.length}/500
        </div>
      </div>

      {/* 제출 버튼 */}
      <Button
        variant="primary"
        fullWidth
        onClick={handleInvite}
        disabled={!partnerEmail.trim() || isLoading}
        loading={isLoading}
        className="mt-6"
      >
        {isLoading ? '초대 발송 중...' : '초대 보내기'}
      </Button>

      {/* 안내 메시지 */}
      <div className="text-center text-sm text-txt-secondary">
        <p>초대를 받은 파트너는 이메일을 통해 알림을 받게 됩니다.</p>
      </div>
    </div>
  );
}; 