// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'invite_code_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$InviteCodeStore on _InviteCodeStore, Store {
  late final _$inviteCodeAtom =
      Atom(name: '_InviteCodeStore.inviteCode', context: context);

  @override
  String? get inviteCode {
    _$inviteCodeAtom.reportRead();
    return super.inviteCode;
  }

  @override
  set inviteCode(String? value) {
    _$inviteCodeAtom.reportWrite(value, super.inviteCode, () {
      super.inviteCode = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_InviteCodeStore.isLoading', context: context);

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

  late final _$generateInviteCodeAsyncAction =
      AsyncAction('_InviteCodeStore.generateInviteCode', context: context);

  @override
  Future<void> generateInviteCode(String channelId) {
    return _$generateInviteCodeAsyncAction
        .run(() => super.generateInviteCode(channelId));
  }

  @override
  String toString() {
    return '''
inviteCode: ${inviteCode},
isLoading: ${isLoading}
    ''';
  }
}
