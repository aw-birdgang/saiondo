import '../../domain/entry/chat.dart';
import '../../domain/repository/chat_history_repository.dart';
import '../adapter/chat_history_adapter.dart';
import '../network/apis/chat_history_api.dart';
import '../network/dto/chat_history_request.dart';

class ChatHistoryRepositoryImpl implements ChatHistoryRepository {
  final ChatHistoryApi api;
  ChatHistoryRepositoryImpl(this.api);

  @override
  Future<List<Chat>> fetchChatHistories(String assistantId) async {
    final responseList = await api.fetchChatHistories(assistantId);
    return responseList.map(ChatHistoryAdapter.fromResponse).toList();
  }

  @override
  Future<Chat> sendMessage(
      String userId, String assistantId, String message) async {
    final req = ChatHistoryRequest(
      userId: userId,
      assistantId: assistantId,
      message: message,
    );
    final res = await api.sendMessage(req);
    return ChatHistoryAdapter.fromResponse(res);
  }
}
