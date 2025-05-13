// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'auth_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$AuthStore on _AuthStore, Store {
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

  late final _$userRoomsAtom =
      Atom(name: '_AuthStore.userRooms', context: context);

  @override
  List<dynamic> get userRooms {
    _$userRoomsAtom.reportRead();
    return super.userRooms;
  }

  @override
  set userRooms(List<dynamic> value) {
    _$userRoomsAtom.reportWrite(value, super.userRooms, () {
      super.userRooms = value;
    });
  }

  late final _$roomIdAtom = Atom(name: '_AuthStore.roomId', context: context);

  @override
  String? get roomId {
    _$roomIdAtom.reportRead();
    return super.roomId;
  }

  @override
  set roomId(String? value) {
    _$roomIdAtom.reportWrite(value, super.roomId, () {
      super.roomId = value;
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

  late final _$logoutAsyncAction =
      AsyncAction('_AuthStore.logout', context: context);

  @override
  Future<void> logout() {
    return _$logoutAsyncAction.run(() => super.logout());
  }

  @override
  String toString() {
    return '''
accessToken: ${accessToken},
userId: ${userId},
user: ${user},
userRooms: ${userRooms},
roomId: ${roomId},
error: ${error},
isLoggedIn: ${isLoggedIn}
    ''';
  }
}
