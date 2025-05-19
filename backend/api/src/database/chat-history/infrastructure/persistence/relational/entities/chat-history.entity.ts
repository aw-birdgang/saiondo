import { MessageSender } from "@prisma/client";
import { UserEntity } from "../../../../../user/infrastructure/persistence/relational/entities/user.entity";

export class ChatHistoryEntity {
  id: string;
  userId: string;
  message: string;
  sender: MessageSender;
  isQuestionResponse: boolean;
  isUserInitiated: boolean;
  analyzedByLlm: boolean;
  createAt: Date;

  // 관계
  user?: UserEntity;
}
