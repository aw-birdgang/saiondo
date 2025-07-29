import 'dart:convert';

import 'package:flutter/material.dart';
import 'package:mobx/mobx.dart';

import '../../../data/network/socket_io/socket_io_service.dart';
import '../../../domain/entry/chat.dart';
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
  ObservableList<Chat> messages = ObservableList<Chat>();

  @observable
  bool isConnected = false;

  @observable
  bool isAwaitingLLM = false;

  @observable
  String? errorMessage;

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
      onError: _onErrorReceived,
    );
    print(
        '[ChatStore] 소켓 연결 시도: userId=$_userId, assistantId=$_assistantId, channelId=$_channelId');
  }

  @action
  void sendMessage(String message) {
    if (_userId == null || _assistantId == null || _channelId == null) {
      print('[ChatStore] sendMessage 호출 전 connect 필요');
      return;
    }
    final userChat = Chat(
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
        final aiChat = Chat.fromJson(map['aiChat']);
        messages.add(aiChat);
        print('[ChatStore] AI 메시지 수신: ${aiChat.message}');
      }
    } catch (e) {
      messages.add(Chat(
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

  @action
  void _onErrorReceived(dynamic error) {
    String msg = '알 수 없는 오류가 발생했습니다.';
    if (error is Map && error['message'] != null) {
      msg = error['message'];
      if (error['status'] == 400 && error['error'] == 'Bad Request') {
        msg = '포인트가 부족합니다. 충전 후 이용해 주세요.';
      }
    } else if (error is String) {
      msg = error;
    }
    errorMessage = msg;
    isAwaitingLLM = false;
    print('[ChatStore] 에러 발생: $msg');
  }

  void dispose() {
    disconnect();
  }
}
