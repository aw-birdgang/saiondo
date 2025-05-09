import 'package:app/domain/entry/chat/chat_history.dart';

import '../../domain/repository/chat_history/chat_history_repository.dart';
import '../network/apis/chat_history_api.dart';

class ChatHistoryRepositoryImpl implements ChatHistoryRepository {
  final ChatHistoryApi api;
  ChatHistoryRepositoryImpl(this.api);

  @override
  Future<List<ChatHistory>> fetchChatHistories(String roomId) =>
      api.fetchChatHistories(roomId);

  @override
  Future<ChatHistory> sendMessage(String userId, String roomId, String message) =>
      api.sendMessage(userId: userId, roomId: roomId, message: message);
}