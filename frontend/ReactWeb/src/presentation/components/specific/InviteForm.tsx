import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Input, Button, InviteIcon, InviteHeader } from '@/presentation/components/common';

interface InviteFormProps {
  onInvite: (email: string) => void;
  isLoading: boolean;
  error: string | null;
  className?: string;
}

const InviteForm: React.FC<InviteFormProps> = ({
  onInvite,
  isLoading,
  error,
  className = '',
}) => {
  const { t } = useTranslation();
  const [partnerEmail, setPartnerEmail] = useState('');

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleInvite = () => {
    const trimmedEmail = partnerEmail.trim();

    // 유효성 검사
    if (!trimmedEmail) {
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      return;
    }

    onInvite(trimmedEmail);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isLoading) {
      handleInvite();
    }
  };

  return (
    <div className={`space-y-8 ${className}`}>
      {/* Icon */}
      <InviteIcon />

      {/* Header */}
      <InviteHeader />

      {/* Email Input */}
      <div className='space-y-3'>
        <Input
          name='partnerEmail'
          type='email'
          placeholder={t('partner_email_placeholder') || '파트너의 이메일 주소'}
          value={partnerEmail}
          onChange={e => setPartnerEmail(e.target.value)}
          onKeyPress={handleKeyPress}
          error={error || undefined}
          disabled={isLoading}
        />
      </div>

      {/* Submit Button */}
      <Button
        variant='primary'
        fullWidth
        onClick={handleInvite}
        disabled={!partnerEmail.trim() || isLoading}
        loading={isLoading}
      >
        {t('send_invite') || '초대 보내기'}
      </Button>
    </div>
  );
};

export default InviteForm;
