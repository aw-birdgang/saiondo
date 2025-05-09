import '../../entry/chat/chat_history.dart';
import '../../repository/chat_history/chat_history_repository.dart';

class SendMessageUseCase {
  final ChatHistoryRepository repository;
  SendMessageUseCase(this.repository);

  Future<ChatHistory> call(String userId, String roomId, String message) =>
      repository.sendMessage(userId, roomId, message);
}