import {MessageSender} from "@prisma/client";

export class ChatHistory {
    id: string;
    userId: string;
    message: string;
    sender: MessageSender;
    isQuestionResponse: boolean;
    isUserInitiated: boolean;
    analyzedByLlm: boolean;
    timestamp: Date;
}
