import React from 'react';
import { useTranslation } from 'react-i18next';

interface EmptyInvitationsStateProps {
  className?: string;
}

const EmptyInvitationsState: React.FC<EmptyInvitationsStateProps> = ({
  className = '',
}) => {
  const { t } = useTranslation();

  return (
    <div className={`text-center py-12 ${className}`}>
      <div className="text-6xl mb-4">📨</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
        {t('no_invitations') || '초대장이 없습니다'}
      </h3>
      <p className="text-gray-600 dark:text-gray-400">
        {t('no_invitations_description') || '새로운 채널 초대장이 도착하면 여기에 표시됩니다.'}
      </p>
    </div>
  );
};

export default EmptyInvitationsState; 