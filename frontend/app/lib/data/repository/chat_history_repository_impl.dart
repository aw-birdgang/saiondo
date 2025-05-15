import 'package:app/domain/entry/chat/chat_history.dart';

import '../../domain/repository/chat_history/chat_history_repository.dart';
import '../adapter/chat_history_adapter.dart';
import '../network/apis/chat_history_api.dart';
import '../network/dto/chat_history_request.dart';

class ChatHistoryRepositoryImpl implements ChatHistoryRepository {
  final ChatHistoryApi api;
  ChatHistoryRepositoryImpl(this.api);

  @override
  Future<List<ChatHistory>> fetchChatHistories(String roomId) async {
    final responseList = await api.fetchChatHistories(roomId); // List<ChatHistoryResponse>
    return responseList.map(ChatHistoryAdapter.fromResponse).toList();
  }

  @override
  Future<ChatHistory> sendMessage(String userId, String roomId, String message) async {
    final req = ChatHistoryRequest(
      userId: userId,
      roomId: roomId,
      message: message,
    );
    final res = await api.sendMessage(req);
    return ChatHistoryAdapter.fromResponse(res);
  }
}