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
  ObservableList<ChatHistory> get messages {
    _$messagesAtom.reportRead();
    return super.messages;
  }

  @override
  set messages(ObservableList<ChatHistory> value) {
    _$messagesAtom.reportWrite(value, super.messages, () {
      super.messages = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_ChatStore.isLoading', context: context);

  @override
  bool get isLoading {
    _$isLoadingAtom.reportRead();
    return super.isLoading;
  }

  @override
  set isLoading(bool value) {
    _$isLoadingAtom.reportWrite(value, super.isLoading, () {
      super.isLoading = value;
    });
  }

  late final _$loadMessagesAsyncAction =
      AsyncAction('_ChatStore.loadMessages', context: context);

  @override
  Future<void> loadMessages(String roomId) {
    return _$loadMessagesAsyncAction.run(() => super.loadMessages(roomId));
  }

  late final _$sendMessageAsyncAction =
      AsyncAction('_ChatStore.sendMessage', context: context);

  @override
  Future<void> sendMessage(String userId, String roomId, String message) {
    return _$sendMessageAsyncAction
        .run(() => super.sendMessage(userId, roomId, message));
  }

  late final _$_ChatStoreActionController =
      ActionController(name: '_ChatStore', context: context);

  @override
  void addMessage(ChatHistory message) {
    final _$actionInfo =
        _$_ChatStoreActionController.startAction(name: '_ChatStore.addMessage');
    try {
      return super.addMessage(message);
    } finally {
      _$_ChatStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
messages: ${messages},
isLoading: ${isLoading}
    ''';
  }
}
