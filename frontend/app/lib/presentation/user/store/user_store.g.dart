// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'user_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$UserStore on _UserStore, Store {
  late final _$usersAtom = Atom(name: '_UserStore.users', context: context);

  @override
  ObservableList<User> get users {
    _$usersAtom.reportRead();
    return super.users;
  }

  @override
  set users(ObservableList<User> value) {
    _$usersAtom.reportWrite(value, super.users, () {
      super.users = value;
    });
  }

  late final _$selectedUserAtom =
      Atom(name: '_UserStore.selectedUser', context: context);

  @override
  User? get selectedUser {
    _$selectedUserAtom.reportRead();
    return super.selectedUser;
  }

  @override
  set selectedUser(User? value) {
    _$selectedUserAtom.reportWrite(value, super.selectedUser, () {
      super.selectedUser = value;
    });
  }

  late final _$userIdAtom = Atom(name: '_UserStore.userId', context: context);

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

  late final _$assistantIdAtom =
      Atom(name: '_UserStore.assistantId', context: context);

  @override
  String? get assistantId {
    _$assistantIdAtom.reportRead();
    return super.assistantId;
  }

  @override
  set assistantId(String? value) {
    _$assistantIdAtom.reportWrite(value, super.assistantId, () {
      super.assistantId = value;
    });
  }

  late final _$channelIdAtom =
      Atom(name: '_UserStore.channelId', context: context);

  @override
  String? get channelId {
    _$channelIdAtom.reportRead();
    return super.channelId;
  }

  @override
  set channelId(String? value) {
    _$channelIdAtom.reportWrite(value, super.channelId, () {
      super.channelId = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_UserStore.isLoading', context: context);

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

  late final _$initUserAsyncAction =
      AsyncAction('_UserStore.initUser', context: context);

  @override
  Future<void> initUser() {
    return _$initUserAsyncAction.run(() => super.initUser());
  }

  late final _$loadUserByIdAsyncAction =
      AsyncAction('_UserStore.loadUserById', context: context);

  @override
  Future<void> loadUserById(String id) {
    return _$loadUserByIdAsyncAction.run(() => super.loadUserById(id));
  }

  late final _$removeUserAsyncAction =
      AsyncAction('_UserStore.removeUser', context: context);

  @override
  Future<void> removeUser() {
    return _$removeUserAsyncAction.run(() => super.removeUser());
  }

  @override
  String toString() {
    return '''
users: ${users},
selectedUser: ${selectedUser},
userId: ${userId},
assistantId: ${assistantId},
channelId: ${channelId},
isLoading: ${isLoading}
    ''';
  }
}
