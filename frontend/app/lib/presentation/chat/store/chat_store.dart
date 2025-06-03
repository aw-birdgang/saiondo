import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';

import '../../../data/network/socket_io/socket_io_service.dart';
import '../../../domain/entry/chat_history.dart';
import '../../../domain/usecase/chat/fetch_chat_histories_usecase.dart';
import '../../../domain/usecase/chat/send_message_usecase.dart';

part 'chat_store.g.dart';

class ChatStore = _ChatStore with _$ChatStore;

abstract class _ChatStore with Store {
  final FetchChatHistoriesUseCase fetchChatHistoriesUseCase;
  final SendMessageUseCase sendMessageUseCase;
  final SocketIoService _socketService;

  _ChatStore(
    this.fetchChatHistoriesUseCase,
    this.sendMessageUseCase,
    this._socketService,
  );

  @observable
  ObservableList<ChatHistory> messages = ObservableList<ChatHistory>();

  @observable
  bool isConnected = false;

  @observable
  bool isAwaitingLLM = false;

  String? _userId;
  String? _assistantId;
  String? _channelId;

  @action
  Future<void> loadMessages(String assistantId) async {
    try {
      final result = await fetchChatHistoriesUseCase(assistantId);
      messages = ObservableList.of(result ?? []);
      print('[ChatStore] 메시지 로딩 성공: ${messages.length}개');
    } catch (e) {
      print('[ChatStore] 메시지 로딩 실패: $e');
      messages = ObservableList.of([]);
    }
  }

  void connect(String userId, String assistantId, String channelId) {
    _userId = userId;
    _assistantId = assistantId;
    _channelId = channelId;
    _socketService.connect(
      onMessage: _onMessageReceived,
      onStatus: _onStatusChanged,
    );
    print('[ChatStore] 소켓 연결 시도: userId=$_userId, assistantId=$_assistantId, channelId=$_channelId');
  }

  @action
  void sendMessage(String message) {
    if (_userId == null || _assistantId == null || _channelId == null) {
      print('[ChatStore] sendMessage 호출 전 connect 필요');
      return;
    }
    final userChat = ChatHistory(
      id: UniqueKey().toString(),
      userId: _userId!,
      assistantId: _assistantId!,
      channelId: _channelId!,
      message: message,
      sender: 'USER',
      createdAt: DateTime.now(),
    );
    messages.add(userChat);
    print('[ChatStore] 사용자 메시지 전송: $message');
    isAwaitingLLM = true;
    _socketService.sendMessage(_userId!, _assistantId!, _channelId!, message);
  }

  void disconnect() {
    if (isConnected) {
      _socketService.disconnect();
      print('[ChatStore] 소켓 연결 해제');
    }
  }

  @action
  void _onMessageReceived(dynamic data) {
    try {
      final map = data is String ? jsonDecode(data) : data;
      if (map['aiChat'] != null) {
        final aiChat = ChatHistory.fromJson(map['aiChat']);
        messages.add(aiChat);
        print('[ChatStore] AI 메시지 수신: ${aiChat.message}');
      }
    } catch (e) {
      messages.add(ChatHistory(
        id: UniqueKey().toString(),
        userId: _assistantId ?? '',
        assistantId: _assistantId ?? '',
        channelId: _channelId ?? '',
        message: data.toString(),
        sender: 'AI',
        createdAt: DateTime.now(),
      ));
      print('[ChatStore] 메시지 파싱 실패: $e, data: $data');
    }
    isAwaitingLLM = false;
  }

  @action
  void _onStatusChanged(bool connected) {
    print('[ChatStore] Socket.io status changed: $connected');
    isConnected = connected;
  }

  void dispose() {
    disconnect();
  }
}