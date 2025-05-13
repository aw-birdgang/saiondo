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

  late final _$userRoomsAtom =
      Atom(name: '_UserStore.userRooms', context: context);

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

  late final _$personaProfileAtom =
      Atom(name: '_UserStore.personaProfile', context: context);

  @override
  PersonaProfile? get personaProfile {
    _$personaProfileAtom.reportRead();
    return super.personaProfile;
  }

  @override
  set personaProfile(PersonaProfile? value) {
    _$personaProfileAtom.reportWrite(value, super.personaProfile, () {
      super.personaProfile = value;
    });
  }

  late final _$loadUsersAsyncAction =
      AsyncAction('_UserStore.loadUsers', context: context);

  @override
  Future<void> loadUsers() {
    return _$loadUsersAsyncAction.run(() => super.loadUsers());
  }

  late final _$loadUserByIdAsyncAction =
      AsyncAction('_UserStore.loadUserById', context: context);

  @override
  Future<void> loadUserById(String id) {
    return _$loadUserByIdAsyncAction.run(() => super.loadUserById(id));
  }

  late final _$loadUserRoomsAsyncAction =
      AsyncAction('_UserStore.loadUserRooms', context: context);

  @override
  Future<void> loadUserRooms(String id) {
    return _$loadUserRoomsAsyncAction.run(() => super.loadUserRooms(id));
  }

  late final _$loadPersonaProfileAsyncAction =
      AsyncAction('_UserStore.loadPersonaProfile', context: context);

  @override
  Future<void> loadPersonaProfile(String userId) {
    return _$loadPersonaProfileAsyncAction
        .run(() => super.loadPersonaProfile(userId));
  }

  @override
  String toString() {
    return '''
users: ${users},
selectedUser: ${selectedUser},
userRooms: ${userRooms},
personaProfile: ${personaProfile}
    ''';
  }
}
