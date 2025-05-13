// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'persona_profile_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$PersonaProfileStore on _PersonaProfileStore, Store {
  late final _$profilesAtom =
      Atom(name: '_PersonaProfileStore.profiles', context: context);

  @override
  ObservableList<PersonaProfile> get profiles {
    _$profilesAtom.reportRead();
    return super.profiles;
  }

  @override
  set profiles(ObservableList<PersonaProfile> value) {
    _$profilesAtom.reportWrite(value, super.profiles, () {
      super.profiles = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_PersonaProfileStore.isLoading', context: context);

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

  late final _$loadProfilesAsyncAction =
      AsyncAction('_PersonaProfileStore.loadProfiles', context: context);

  @override
  Future<void> loadProfiles(String userId) {
    return _$loadProfilesAsyncAction.run(() => super.loadProfiles(userId));
  }

  late final _$addProfileAsyncAction =
      AsyncAction('_PersonaProfileStore.addProfile', context: context);

  @override
  Future<void> addProfile(String userId, PersonaProfile profile) {
    return _$addProfileAsyncAction.run(() => super.addProfile(userId, profile));
  }

  late final _$updateProfileAsyncAction =
      AsyncAction('_PersonaProfileStore.updateProfile', context: context);

  @override
  Future<void> updateProfile(String userId, PersonaProfile profile) {
    return _$updateProfileAsyncAction
        .run(() => super.updateProfile(userId, profile));
  }

  @override
  String toString() {
    return '''
profiles: ${profiles},
isLoading: ${isLoading}
    ''';
  }
}
