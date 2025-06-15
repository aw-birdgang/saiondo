import {MessageSender} from '@prisma/client';

export class Chat {
  public id: string;
  public assistantId: string;
  public channelId: string;
  public userId: string;
  public sender: MessageSender;
  public message: string;
  public createdAt: Date;
  // 관계 필드는 필요시 추가 (예: assistant, channel, user)
  // public assistant?: Assistant;
  // public channel?: Channel;
  // public user?: User;
}
