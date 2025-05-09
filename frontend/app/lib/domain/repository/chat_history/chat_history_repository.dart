import '../../entry/chat/chat_history.dart';

abstract class ChatHistoryRepository {
  Future<List<ChatHistory>> fetchChatHistories(String roomId);
  Future<ChatHistory> sendMessage(String userId, String roomId, String message);
}