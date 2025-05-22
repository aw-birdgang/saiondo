import '../../entry/chat_history.dart';
import '../../repository/chat_history_repository.dart';

class SendMessageUseCase {
  final ChatHistoryRepository repository;
  SendMessageUseCase(this.repository);

  Future<ChatHistory> call(String userId, String assistantId, String message) =>
      repository.sendMessage(userId, assistantId, message);
}