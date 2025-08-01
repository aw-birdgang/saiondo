import React from 'react';
import { useTranslation } from 'react-i18next';

interface InviteHeaderProps {
  title?: string;
  subtitle?: string;
  className?: string;
}

const InviteHeader: React.FC<InviteHeaderProps> = ({
  title,
  subtitle,
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`text-center mb-6 ${className}`}>
      <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {title || t('invite_partner_desc') || '연인/파트너의 이메일을 입력해 초대해보세요!'}
      </h2>
      <p className="text-gray-600 dark:text-gray-400">
        {subtitle || t('invite_partner_subtitle') || '함께 대화하고 관계를 분석해보세요.'}
      </p>
    </div>
  );
};

export default InviteHeader; 