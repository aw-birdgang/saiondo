// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ChannelStore on _ChannelStore, Store {
  late final _$availableChannelsAtom =
      Atom(name: '_ChannelStore.availableChannels', context: context);

  @override
  ObservableList<Channel> get availableChannels {
    _$availableChannelsAtom.reportRead();
    return super.availableChannels;
  }

  @override
  set availableChannels(ObservableList<Channel> value) {
    _$availableChannelsAtom.reportWrite(value, super.availableChannels, () {
      super.availableChannels = value;
    });
  }

  late final _$userChannelsAtom =
      Atom(name: '_ChannelStore.userChannels', context: context);

  @override
  ObservableList<Channel> get userChannels {
    _$userChannelsAtom.reportRead();
    return super.userChannels;
  }

  @override
  set userChannels(ObservableList<Channel> value) {
    _$userChannelsAtom.reportWrite(value, super.userChannels, () {
      super.userChannels = value;
    });
  }

  late final _$currentChannelAtom =
      Atom(name: '_ChannelStore.currentChannel', context: context);

  @override
  Channel? get currentChannel {
    _$currentChannelAtom.reportRead();
    return super.currentChannel;
  }

  @override
  set currentChannel(Channel? value) {
    _$currentChannelAtom.reportWrite(value, super.currentChannel, () {
      super.currentChannel = value;
    });
  }

  late final _$isLoadingAtom =
      Atom(name: '_ChannelStore.isLoading', context: context);

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

  late final _$errorAtom = Atom(name: '_ChannelStore.error', context: context);

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

  late final _$successMessageAtom =
      Atom(name: '_ChannelStore.successMessage', context: context);

  @override
  String? get successMessage {
    _$successMessageAtom.reportRead();
    return super.successMessage;
  }

  @override
  set successMessage(String? value) {
    _$successMessageAtom.reportWrite(value, super.successMessage, () {
      super.successMessage = value;
    });
  }

  late final _$fetchAllChannelsAsyncAction =
      AsyncAction('_ChannelStore.fetchAllChannels', context: context);

  @override
  Future<void> fetchAllChannels() {
    return _$fetchAllChannelsAsyncAction.run(() => super.fetchAllChannels());
  }

  late final _$fetchChannelAsyncAction =
      AsyncAction('_ChannelStore.fetchChannel', context: context);

  @override
  Future<void> fetchChannel(String channelId) {
    return _$fetchChannelAsyncAction.run(() => super.fetchChannel(channelId));
  }

  late final _$fetchChannelsByUserIdAsyncAction =
      AsyncAction('_ChannelStore.fetchChannelsByUserId', context: context);

  @override
  Future<void> fetchChannelsByUserId(String userId) {
    return _$fetchChannelsByUserIdAsyncAction
        .run(() => super.fetchChannelsByUserId(userId));
  }

  late final _$fetchCurrentChannelAsyncAction =
      AsyncAction('_ChannelStore.fetchCurrentChannel', context: context);

  @override
  Future<void> fetchCurrentChannel(String userId) {
    return _$fetchCurrentChannelAsyncAction
        .run(() => super.fetchCurrentChannel(userId));
  }

  late final _$createChannelAsyncAction =
      AsyncAction('_ChannelStore.createChannel', context: context);

  @override
  Future<Channel?> createChannel(String userId) {
    return _$createChannelAsyncAction.run(() => super.createChannel(userId));
  }

  late final _$joinByInviteAsyncAction =
      AsyncAction('_ChannelStore.joinByInvite', context: context);

  @override
  Future<bool> joinByInvite(String inviteCode, String userId) {
    return _$joinByInviteAsyncAction
        .run(() => super.joinByInvite(inviteCode, userId));
  }

  late final _$addMemberAsyncAction =
      AsyncAction('_ChannelStore.addMember', context: context);

  @override
  Future<void> addMember(String channelId, String userId) {
    return _$addMemberAsyncAction.run(() => super.addMember(channelId, userId));
  }

  late final _$createInviteCodeAsyncAction =
      AsyncAction('_ChannelStore.createInviteCode', context: context);

  @override
  Future<String?> createInviteCode(String channelId, String userId) {
    return _$createInviteCodeAsyncAction
        .run(() => super.createInviteCode(channelId, userId));
  }

  late final _$fetchAvailableChannelsAsyncAction =
      AsyncAction('_ChannelStore.fetchAvailableChannels', context: context);

  @override
  Future<void> fetchAvailableChannels() {
    return _$fetchAvailableChannelsAsyncAction
        .run(() => super.fetchAvailableChannels());
  }

  late final _$leaveChannelAsyncAction =
      AsyncAction('_ChannelStore.leaveChannel', context: context);

  @override
  Future<void> leaveChannel(String userId) {
    return _$leaveChannelAsyncAction.run(() => super.leaveChannel(userId));
  }

  @override
  String toString() {
    return '''
availableChannels: ${availableChannels},
userChannels: ${userChannels},
currentChannel: ${currentChannel},
isLoading: ${isLoading},
error: ${error},
successMessage: ${successMessage}
    ''';
  }
}
