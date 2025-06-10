// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ChannelStore on _ChannelStore, Store {
  late final _$channelsAtom =
      Atom(name: '_ChannelStore.channels', context: context);

  @override
  ObservableList<Channel> get channels {
    _$channelsAtom.reportRead();
    return super.channels;
  }

  @override
  set channels(ObservableList<Channel> value) {
    _$channelsAtom.reportWrite(value, super.channels, () {
      super.channels = value;
    });
  }

  late final _$channelAtom =
      Atom(name: '_ChannelStore.channel', context: context);

  @override
  Channel? get channel {
    _$channelAtom.reportRead();
    return super.channel;
  }

  @override
  set channel(Channel? value) {
    _$channelAtom.reportWrite(value, super.channel, () {
      super.channel = value;
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

  late final _$errorMessageAtom =
      Atom(name: '_ChannelStore.errorMessage', context: context);

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

  late final _$createOrGetChannelAsyncAction =
      AsyncAction('_ChannelStore.createOrGetChannel', context: context);

  @override
  Future<void> createOrGetChannel(String user1Id, String user2Id) {
    return _$createOrGetChannelAsyncAction
        .run(() => super.createOrGetChannel(user1Id, user2Id));
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

  @override
  String toString() {
    return '''
channels: ${channels},
channel: ${channel},
isLoading: ${isLoading},
errorMessage: ${errorMessage},
successMessage: ${successMessage}
    ''';
  }
}
