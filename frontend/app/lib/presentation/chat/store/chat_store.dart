import 'package:mobx/mobx.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../domain/entry/chat/chat.dart';
import '../../../domain/usecase/chat/send_message_usecase.dart';

part 'chat_store.g.dart';

class ChatStore = _ChatStore with _$ChatStore;

abstract class _ChatStore with Store {


  @observable
  ObservableList<Chat> messages = ObservableList<Chat>();

  @observable
  bool isLoading = false;

  _ChatStore(this._sendMessageUseCase, this.errorStore) {
    _setupDisposers();
  }

  final SendMessageUseCase _sendMessageUseCase;
  // store for handling error messages
  final ErrorStore errorStore;


  void _setupDisposers() {
    _listenToMessages();
  }

  @action
  Future<void> sendMessage(String message) async {
    try {
      isLoading = true;
      await _sendMessageUseCase.call(params: message);
    } finally {
      isLoading = false;
    }
  }

  void _listenToMessages() {
    // 메시지 스트림 구독
  }
}