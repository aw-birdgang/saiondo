import '../entry/chat.dart';

abstract class ChatHistoryRepository {
  Future<List<Chat>> fetchChatHistories(String assistantId);
  Future<Chat> sendMessage(String userId, String assistantId, String message);
}
