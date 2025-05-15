import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';
import 'dart:convert';

import '../../../data/network/socket_io/socket_io_service.dart';
import '../../../domain/entry/chat/chat_history.dart';
import '../../../domain/usecase/chat/fetch_chat_histories_usecase.dart';
import '../../../domain/usecase/chat/send_message_usecase.dart';

part 'chat_store.g.dart';

class ChatStore = _ChatStore with _$ChatStore;

abstract class _ChatStore with Store {
  final FetchChatHistoriesUseCase fetchChatHistoriesUseCase;
  final SendMessageUseCase sendMessageUseCase;
  final SocketIoService _socketService;

  _ChatStore(this.fetchChatHistoriesUseCase, this.sendMessageUseCase, this._socketService);

  @observable
  ObservableList<ChatHistory> messages = ObservableList<ChatHistory>();

  @observable
  bool isConnected = false;

  late String _userId;
  late String _roomId;

  @action
  Future<void> loadMessages(String roomId) async {
    try {
      final result = await fetchChatHistoriesUseCase(roomId);
      messages = ObservableList.of(result ?? []);
    } catch (e) {
      print('[ChatStore] 메시지 로딩 실패: $e');
      messages = ObservableList.of([]);
    }
  }

  void connect(String userId, String roomId) {
    _userId = userId;
    _roomId = roomId;
    _socketService.connect(
      onMessage: _onMessageReceived,
      onStatus: (connected) {
        isConnected = connected;
      },
    );
  }

  @action
  void sendMessage(String message) {
    final userChat = ChatHistory(
      id: UniqueKey().toString(),
      userId: _userId,
      roomId: _roomId,
      message: message,
      sender: 'USER',
      timestamp: DateTime.now(),
    );
    messages.add(userChat);
    _socketService.sendMessage(_userId, _roomId, message);
  }

  void disconnect() {
    _socketService.disconnect();
  }

  @action
  void _onMessageReceived(dynamic data) {
    try {
      final map = data is String ? jsonDecode(data) : data;
      if (map['aiChat'] != null) {
        final aiChat = ChatHistory.fromJson(map['aiChat']);
        messages.add(aiChat);
      }
    } catch (e) {
      print('[ChatStore] 메시지 파싱 실패: $e, data: $data');
    }
  }

  @action
  void _onStatusChanged(bool connected) {
    print('[ChatStore] Socket.io status changed: $connected');
    isConnected = connected;
  }

  void dispose() {
    _socketService.disconnect();
  }
}