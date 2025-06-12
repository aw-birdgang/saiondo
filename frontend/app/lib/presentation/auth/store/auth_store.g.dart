// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AuthStore on _AuthStore, Store {
  late final _$successAtom = Atom(name: '_AuthStore.success', context: context);

  @override
  bool get success {
    _$successAtom.reportRead();
    return super.success;
  }

  @override
  set success(bool value) {
    _$successAtom.reportWrite(value, super.success, () {
      super.success = value;
    });
  }

  late final _$accessTokenAtom =
      Atom(name: '_AuthStore.accessToken', context: context);

  @override
  String? get accessToken {
    _$accessTokenAtom.reportRead();
    return super.accessToken;
  }

  @override
  set accessToken(String? value) {
    _$accessTokenAtom.reportWrite(value, super.accessToken, () {
      super.accessToken = value;
    });
  }

  late final _$userIdAtom = Atom(name: '_AuthStore.userId', context: context);

  @override
  String? get userId {
    _$userIdAtom.reportRead();
    return super.userId;
  }

  @override
  set userId(String? value) {
    _$userIdAtom.reportWrite(value, super.userId, () {
      super.userId = value;
    });
  }

  late final _$fcmTokenAtom =
      Atom(name: '_AuthStore.fcmToken', context: context);

  @override
  String? get fcmToken {
    _$fcmTokenAtom.reportRead();
    return super.fcmToken;
  }

  @override
  set fcmToken(String? value) {
    _$fcmTokenAtom.reportWrite(value, super.fcmToken, () {
      super.fcmToken = value;
    });
  }

  late final _$fcmRegisteredAtom =
      Atom(name: '_AuthStore.fcmRegistered', context: context);

  @override
  bool get fcmRegistered {
    _$fcmRegisteredAtom.reportRead();
    return super.fcmRegistered;
  }

  @override
  set fcmRegistered(bool value) {
    _$fcmRegisteredAtom.reportWrite(value, super.fcmRegistered, () {
      super.fcmRegistered = value;
    });
  }

  late final _$userAtom = Atom(name: '_AuthStore.user', context: context);

  @override
  Map<String, dynamic>? get user {
    _$userAtom.reportRead();
    return super.user;
  }

  @override
  set user(Map<String, dynamic>? value) {
    _$userAtom.reportWrite(value, super.user, () {
      super.user = value;
    });
  }

  late final _$errorAtom = Atom(name: '_AuthStore.error', context: context);

  @override
  String? get error {
    _$errorAtom.reportRead();
    return super.error;
  }

  @override
  set error(String? value) {
    _$errorAtom.reportWrite(value, super.error, () {
      super.error = value;
    });
  }

  late final _$isLoggedInAtom =
      Atom(name: '_AuthStore.isLoggedIn', context: context);

  @override
  bool get isLoggedIn {
    _$isLoggedInAtom.reportRead();
    return super.isLoggedIn;
  }

  @override
  set isLoggedIn(bool value) {
    _$isLoggedInAtom.reportWrite(value, super.isLoggedIn, () {
      super.isLoggedIn = value;
    });
  }

  late final _$unreadPushCountAtom =
      Atom(name: '_AuthStore.unreadPushCount', context: context);

  @override
  int get unreadPushCount {
    _$unreadPushCountAtom.reportRead();
    return super.unreadPushCount;
  }

  @override
  set unreadPushCount(int value) {
    _$unreadPushCountAtom.reportWrite(value, super.unreadPushCount, () {
      super.unreadPushCount = value;
    });
  }

  late final _$pushMessagesAtom =
      Atom(name: '_AuthStore.pushMessages', context: context);

  @override
  ObservableList<String> get pushMessages {
    _$pushMessagesAtom.reportRead();
    return super.pushMessages;
  }

  @override
  set pushMessages(ObservableList<String> value) {
    _$pushMessagesAtom.reportWrite(value, super.pushMessages, () {
      super.pushMessages = value;
    });
  }

  late final _$lastPushMessageAtom =
      Atom(name: '_AuthStore.lastPushMessage', context: context);

  @override
  String? get lastPushMessage {
    _$lastPushMessageAtom.reportRead();
    return super.lastPushMessage;
  }

  @override
  set lastPushMessage(String? value) {
    _$lastPushMessageAtom.reportWrite(value, super.lastPushMessage, () {
      super.lastPushMessage = value;
    });
  }

  late final _$loginAsyncAction =
      AsyncAction('_AuthStore.login', context: context);

  @override
  Future<bool> login(String email, String password) {
    return _$loginAsyncAction.run(() => super.login(email, password));
  }

  late final _$registerAsyncAction =
      AsyncAction('_AuthStore.register', context: context);

  @override
  Future<void> register(
      String email, String password, String name, String gender) {
    return _$registerAsyncAction
        .run(() => super.register(email, password, name, gender));
  }

  late final _$loadAuthFromPrefsAsyncAction =
      AsyncAction('_AuthStore.loadAuthFromPrefs', context: context);

  @override
  Future<void> loadAuthFromPrefs() {
    return _$loadAuthFromPrefsAsyncAction.run(() => super.loadAuthFromPrefs());
  }

  late final _$registerFcmTokenAsyncAction =
      AsyncAction('_AuthStore.registerFcmToken', context: context);

  @override
  Future<void> registerFcmToken() {
    return _$registerFcmTokenAsyncAction.run(() => super.registerFcmToken());
  }

  late final _$logoutAsyncAction =
      AsyncAction('_AuthStore.logout', context: context);

  @override
  Future<void> logout() {
    return _$logoutAsyncAction.run(() => super.logout());
  }

  late final _$clearUserCacheAsyncAction =
      AsyncAction('_AuthStore.clearUserCache', context: context);

  @override
  Future<void> clearUserCache() {
    return _$clearUserCacheAsyncAction.run(() => super.clearUserCache());
  }

  late final _$_AuthStoreActionController =
      ActionController(name: '_AuthStore', context: context);

  @override
  void incrementUnreadPush([String? message]) {
    final _$actionInfo = _$_AuthStoreActionController.startAction(
        name: '_AuthStore.incrementUnreadPush');
    try {
      return super.incrementUnreadPush(message);
    } finally {
      _$_AuthStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void clearUnreadPush() {
    final _$actionInfo = _$_AuthStoreActionController.startAction(
        name: '_AuthStore.clearUnreadPush');
    try {
      return super.clearUnreadPush();
    } finally {
      _$_AuthStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  void clearAllPushMessages() {
    final _$actionInfo = _$_AuthStoreActionController.startAction(
        name: '_AuthStore.clearAllPushMessages');
    try {
      return super.clearAllPushMessages();
    } finally {
      _$_AuthStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
success: ${success},
accessToken: ${accessToken},
userId: ${userId},
fcmToken: ${fcmToken},
fcmRegistered: ${fcmRegistered},
user: ${user},
error: ${error},
isLoggedIn: ${isLoggedIn},
unreadPushCount: ${unreadPushCount},
pushMessages: ${pushMessages},
lastPushMessage: ${lastPushMessage}
    ''';
  }
}
