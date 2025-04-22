// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'profile_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ProfileStore on _ProfileStore, Store {
  Computed<bool>? _$hasUserComputed;

  @override
  bool get hasUser => (_$hasUserComputed ??=
          Computed<bool>(() => super.hasUser, name: '_ProfileStore.hasUser'))
      .value;

  late final _$isLoadingAtom =
      Atom(name: '_ProfileStore.isLoading', context: context);

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

  late final _$userAtom = Atom(name: '_ProfileStore.user', context: context);

  @override
  User? get user {
    _$userAtom.reportRead();
    return super.user;
  }

  @override
  set user(User? value) {
    _$userAtom.reportWrite(value, super.user, () {
      super.user = value;
    });
  }

  late final _$errorAtom = Atom(name: '_ProfileStore.error', context: context);

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

  late final _$loadUserProfileAsyncAction =
      AsyncAction('_ProfileStore.loadUserProfile', context: context);

  @override
  Future<void> loadUserProfile() {
    return _$loadUserProfileAsyncAction.run(() => super.loadUserProfile());
  }

  late final _$updateProfileAsyncAction =
      AsyncAction('_ProfileStore.updateProfile', context: context);

  @override
  Future<void> updateProfile(
      {String? displayName,
      String? photoUrl,
      String? mbti,
      String? loveLanguage}) {
    return _$updateProfileAsyncAction.run(() => super.updateProfile(
        displayName: displayName,
        photoUrl: photoUrl,
        mbti: mbti,
        loveLanguage: loveLanguage));
  }

  late final _$_ProfileStoreActionController =
      ActionController(name: '_ProfileStore', context: context);

  @override
  void reset() {
    final _$actionInfo = _$_ProfileStoreActionController.startAction(
        name: '_ProfileStore.reset');
    try {
      return super.reset();
    } finally {
      _$_ProfileStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
isLoading: ${isLoading},
user: ${user},
error: ${error},
hasUser: ${hasUser}
    ''';
  }
}
