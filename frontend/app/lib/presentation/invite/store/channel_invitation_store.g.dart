// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_invitation_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ChannelInvitationStore on _ChannelInvitationStore, Store {
  late final _$invitationsAtom =
      Atom(name: '_ChannelInvitationStore.invitations', context: context);

  @override
  ObservableList<ChannelInvitation> get invitations {
    _$invitationsAtom.reportRead();
    return super.invitations;
  }

  @override
  set invitations(ObservableList<ChannelInvitation> value) {
    _$invitationsAtom.reportWrite(value, super.invitations, () {
      super.invitations = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_ChannelInvitationStore.isLoading', context: context);

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

  late final _$errorMessageAtom =
      Atom(name: '_ChannelInvitationStore.errorMessage', context: context);

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

  late final _$inviteCodeAtom =
      Atom(name: '_ChannelInvitationStore.inviteCode', context: context);

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

  late final _$isLoadingInviteCodeAtom = Atom(
      name: '_ChannelInvitationStore.isLoadingInviteCode', context: context);

  @override
  bool get isLoadingInviteCode {
    _$isLoadingInviteCodeAtom.reportRead();
    return super.isLoadingInviteCode;
  }

  @override
  set isLoadingInviteCode(bool value) {
    _$isLoadingInviteCodeAtom.reportWrite(value, super.isLoadingInviteCode, () {
      super.isLoadingInviteCode = value;
    });
  }

  late final _$inviteCodeErrorAtom =
      Atom(name: '_ChannelInvitationStore.inviteCodeError', context: context);

  @override
  String? get inviteCodeError {
    _$inviteCodeErrorAtom.reportRead();
    return super.inviteCodeError;
  }

  @override
  set inviteCodeError(String? value) {
    _$inviteCodeErrorAtom.reportWrite(value, super.inviteCodeError, () {
      super.inviteCodeError = value;
    });
  }

  late final _$generateInviteCodeAsyncAction = AsyncAction(
      '_ChannelInvitationStore.generateInviteCode',
      context: context);

  @override
  Future<void> generateInviteCode(String channelId, String userId) {
    return _$generateInviteCodeAsyncAction
        .run(() => super.generateInviteCode(channelId, userId));
  }

  late final _$fetchInvitationsAsyncAction =
      AsyncAction('_ChannelInvitationStore.fetchInvitations', context: context);

  @override
  Future<void> fetchInvitations(String userId) {
    return _$fetchInvitationsAsyncAction
        .run(() => super.fetchInvitations(userId));
  }

  late final _$respondToInvitationAsyncAction = AsyncAction(
      '_ChannelInvitationStore.respondToInvitation',
      context: context);

  @override
  Future<void> respondToInvitation(
      String invitationId, bool accept, String userId) {
    return _$respondToInvitationAsyncAction
        .run(() => super.respondToInvitation(invitationId, accept, userId));
  }

  @override
  String toString() {
    return '''
invitations: ${invitations},
isLoading: ${isLoading},
errorMessage: ${errorMessage},
inviteCode: ${inviteCode},
isLoadingInviteCode: ${isLoadingInviteCode},
inviteCodeError: ${inviteCodeError}
    ''';
  }
}
