// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'chat_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ChatStore on _ChatStore, Store {
  late final _$messagesAtom =
      Atom(name: '_ChatStore.messages', context: context);

  @override
  ObservableList<Chat> get messages {
    _$messagesAtom.reportRead();
    return super.messages;
  }

  @override
  set messages(ObservableList<Chat> value) {
    _$messagesAtom.reportWrite(value, super.messages, () {
      super.messages = value;
    });
  }

  late final _$isConnectedAtom =
      Atom(name: '_ChatStore.isConnected', context: context);

  @override
  bool get isConnected {
    _$isConnectedAtom.reportRead();
    return super.isConnected;
  }

  @override
  set isConnected(bool value) {
    _$isConnectedAtom.reportWrite(value, super.isConnected, () {
      super.isConnected = value;
    });
  }

  late final _$isAwaitingLLMAtom =
      Atom(name: '_ChatStore.isAwaitingLLM', context: context);

  @override
  bool get isAwaitingLLM {
    _$isAwaitingLLMAtom.reportRead();
    return super.isAwaitingLLM;
  }

  @override
  set isAwaitingLLM(bool value) {
    _$isAwaitingLLMAtom.reportWrite(value, super.isAwaitingLLM, () {
      super.isAwaitingLLM = value;
    });
  }

  late final _$errorMessageAtom =
      Atom(name: '_ChatStore.errorMessage', context: context);

  @override
  String? get errorMessage {
    _$errorMessageAtom.reportRead();
    return super.errorMessage;
  }

  @override
  set errorMessage(String? value) {
    _$errorMessageAtom.reportWrite(value, super.errorMessage, () {
      super.errorMessage = value;
    });
  }

  late final _$loadMessagesAsyncAction =
      AsyncAction('_ChatStore.loadMessages', context: context);

  @override
  Future<void> loadMessages(String assistantId) {
    return _$loadMessagesAsyncAction.run(() => super.loadMessages(assistantId));
  }

  late final _$_ChatStoreActionController =
      ActionController(name: '_ChatStore', context: context);

  @override
  void sendMessage(String message) {
    final _$actionInfo = _$_ChatStoreActionController.startAction(
        name: '_ChatStore.sendMessage');
    try {
      return super.sendMessage(message);
    } finally {
      _$_ChatStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void _onMessageReceived(dynamic data) {
    final _$actionInfo = _$_ChatStoreActionController.startAction(
        name: '_ChatStore._onMessageReceived');
    try {
      return super._onMessageReceived(data);
    } finally {
      _$_ChatStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void _onStatusChanged(bool connected) {
    final _$actionInfo = _$_ChatStoreActionController.startAction(
        name: '_ChatStore._onStatusChanged');
    try {
      return super._onStatusChanged(connected);
    } finally {
      _$_ChatStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void _onErrorReceived(dynamic error) {
    final _$actionInfo = _$_ChatStoreActionController.startAction(
        name: '_ChatStore._onErrorReceived');
    try {
      return super._onErrorReceived(error);
    } finally {
      _$_ChatStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
messages: ${messages},
isConnected: ${isConnected},
isAwaitingLLM: ${isAwaitingLLM},
errorMessage: ${errorMessage}
    ''';
  }
}
