import '../../domain/entry/chat_history.dart';
import '../network/dto/chat_history_request.dart';
import '../network/dto/chat_history_response.dart';

class ChatHistoryAdapter {
  static ChatHistory fromResponse(ChatHistoryResponse res) => ChatHistory(
    id: res.id,
    userId: res.userId,
    message: res.message,
    sender: res.sender,
    createdAt: res.createdAt,
    assistantId: res.assistantId,
    channelId: res.channelId,
  );

  static ChatHistoryRequest toRequest(ChatHistory entity) => ChatHistoryRequest(
    userId: entity.userId,
    assistantId: entity.assistantId,
    message: entity.message,
  );
}