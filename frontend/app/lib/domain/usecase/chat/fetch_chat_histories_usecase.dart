import '../../entry/chat/chat_history.dart';
import '../../repository/chat_history/chat_history_repository.dart';

class FetchChatHistoriesUseCase {
  final ChatHistoryRepository repository;
  FetchChatHistoriesUseCase(this.repository);

  Future<List<ChatHistory>> call(String assistantId) async {
    return await repository.fetchChatHistories(assistantId);
  }
}