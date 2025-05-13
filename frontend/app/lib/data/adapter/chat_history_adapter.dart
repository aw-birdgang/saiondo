import '../../domain/entry/chat/chat_history.dart';
import '../network/dto/chat_history_request.dart';
import '../network/dto/chat_history_response.dart';

class ChatHistoryAdapter {
  static ChatHistory fromResponse(ChatHistoryResponse res) => ChatHistory(
    id: res.id,
    userId: res.userId,
    message: res.message,
    sender: res.sender,
    timestamp: res.timestamp,
    roomId: res.roomId,
  );

  static ChatHistoryRequest toRequest(ChatHistory entity) => ChatHistoryRequest(
    userId: entity.userId,
    roomId: entity.roomId,
    message: entity.message,
  );
}