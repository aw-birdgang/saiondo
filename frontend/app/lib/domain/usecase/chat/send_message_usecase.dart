import '../../entry/chat.dart';
import '../../repository/chat_history_repository.dart';

class SendMessageUseCase {
  final ChatHistoryRepository repository;
  SendMessageUseCase(this.repository);

  Future<Chat> call(String userId, String assistantId, String message) =>
      repository.sendMessage(userId, assistantId, message);
}