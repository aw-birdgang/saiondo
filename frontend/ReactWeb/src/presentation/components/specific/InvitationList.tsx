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
      <div className={`text-center py-16 ${className}`}>
        <div className="text-6xl mb-6 animate-pulse">📨</div>
        <h3 className="text-2xl font-bold text-text mb-4 leading-tight">
          {t('no_invitations') || '초대장이 없습니다'}
        </h3>
        <p className="text-text-secondary text-lg leading-relaxed">
          {t('no_invitations_description') || '현재 받은 채널 초대장이 없습니다.'}
        </p>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
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