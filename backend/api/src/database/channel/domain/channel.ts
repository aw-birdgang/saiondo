export class Channel {
  public id: string;
  public createdAt?: Date;
  public updatedAt?: Date;
  public inviteCode?: string | null | undefined;
  public status?: string;
  public startedAt: Date | null = null;
  public endedAt: Date | null = null;
  public anniversary: Date | null = null;
  public keywords: string | null = null;
  public deletedAt: Date | null;
  public assistants?: any[];
  public advices?: any[];
  public chatHistories?: any[];
  public coupleAnalyses?: any[];
  public members?: any[];
  public invitations?: any[];
}
