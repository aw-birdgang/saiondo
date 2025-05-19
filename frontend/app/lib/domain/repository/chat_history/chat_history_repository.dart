import '../../entry/chat/chat_history.dart';

abstract class ChatHistoryRepository {
  Future<List<ChatHistory>> fetchChatHistories(String assistantId);
  Future<ChatHistory> sendMessage(String userId, String assistantId, String message);
}