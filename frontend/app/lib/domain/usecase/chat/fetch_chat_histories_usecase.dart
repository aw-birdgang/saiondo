import '../../entry/chat.dart';
import '../../repository/chat_history_repository.dart';

class FetchChatHistoriesUseCase {
  final ChatHistoryRepository repository;
  FetchChatHistoriesUseCase(this.repository);

  Future<List<Chat>> call(String assistantId) async {
    return await repository.fetchChatHistories(assistantId);
  }
}