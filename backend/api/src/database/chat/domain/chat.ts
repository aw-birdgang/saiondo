import { MessageSender } from '@prisma/client';

export class Chat {
  id: string;
  userId: string;
  message: string;
  sender: MessageSender;
  isQuestionResponse: boolean;
  isUserInitiated: boolean;
  analyzedByLlm: boolean;
  createAt: Date;
}
