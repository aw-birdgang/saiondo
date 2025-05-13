import 'package:mobx/mobx.dart';
import '../../../domain/entry/chat/chat_history.dart';
import '../../../domain/usecase/chat/fetch_chat_histories_usecase.dart';
import '../../../domain/usecase/chat/send_message_usecase.dart';

part 'chat_store.g.dart';

class ChatStore = _ChatStore with _$ChatStore;

abstract class _ChatStore with Store {
  final FetchChatHistoriesUseCase fetchChatHistoriesUseCase;
  final SendMessageUseCase sendMessageUseCase;

  _ChatStore(this.fetchChatHistoriesUseCase, this.sendMessageUseCase);

  @observable
  ObservableList<ChatHistory> messages = ObservableList<ChatHistory>();

  @observable
  bool isLoading = false;

  @action
  Future<void> loadMessages(String roomId) async {
    isLoading = true;
    final result = await fetchChatHistoriesUseCase(roomId);
    messages = ObservableList.of(result);
    isLoading = false;
  }

  @action
  Future<void> sendMessage(String userId, String roomId, String message) async {
    isLoading = true;
    final chat = await sendMessageUseCase(userId, roomId, message);
    messages.insert(0, chat);
    isLoading = false;
  }

  @action
  void addMessage(ChatHistory message) {
    messages.add(message);
  }
}