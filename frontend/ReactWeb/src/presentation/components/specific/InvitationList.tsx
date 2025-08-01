import React from "react";
import { useTranslation } from "react-i18next";
import InvitationCard from "./InvitationCard";

interface ChannelInvitation {
  id: string;
  inviterId: string;
  inviteeId: string;
  channelId: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Date;
  inviterName?: string;
  channelName?: string;
}

interface InvitationListProps {
  invitations: ChannelInvitation[];
  onAccept: (invitationId: string) => void;
  onReject: (invitationId: string) => void;
  className?: string;
}

const InvitationList: React.FC<InvitationListProps> = ({ 
  invitations, 
  onAccept, 
  onReject, 
  className = "" 
}) => {
  const { t } = useTranslation();

  if (invitations.length === 0) {
    return (
      <div className={`text-center py-12 ${className}`}>
        <div className="text-6xl mb-4">📨</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          {t('no_invitations') || '초대장이 없습니다'}
        </h3>
        <p className="text-gray-600 dark:text-gray-400">
          {t('no_invitations_description') || '현재 받은 채널 초대장이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {invitations.map((invitation) => (
        <InvitationCard
          key={invitation.id}
          invitation={invitation}
          onAccept={onAccept}
          onReject={onReject}
        />
      ))}
    </div>
  );
};

export default InvitationList; 