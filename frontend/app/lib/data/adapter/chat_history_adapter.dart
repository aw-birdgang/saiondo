import '../../domain/entry/chat.dart';
import '../network/dto/chat_history_request.dart';
import '../network/dto/chat_history_response.dart';

class ChatHistoryAdapter {
  static Chat fromResponse(ChatHistoryResponse res) => Chat(
        id: res.id,
        userId: res.userId,
        message: res.message,
        sender: res.sender,
        createdAt: res.createdAt,
        assistantId: res.assistantId,
        channelId: res.channelId,
      );

  static ChatHistoryRequest toRequest(Chat entity) => ChatHistoryRequest(
        userId: entity.userId,
        assistantId: entity.assistantId,
        message: entity.message,
      );
}
