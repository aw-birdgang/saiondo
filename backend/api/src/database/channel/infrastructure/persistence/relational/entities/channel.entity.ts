export class ChannelEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  inviteCode?: string | null;
  status: string;
  startedAt: Date | null;
  endedAt: Date | null;
  anniversary: Date | null;
  keywords: string | null;
  deletedAt: Date | null;
  assistants?: any[];
  advices?: any[];
  chatHistories?: any[];
  coupleAnalyses?: any[];
  members?: any[];
  invitations?: any[];
}
