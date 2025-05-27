// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'channel_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$ChannelStore on _ChannelStore, Store {
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

  late final _$fetchChannelAsyncAction =
      AsyncAction('_ChannelStore.fetchChannel', context: context);

  @override
  Future<void> fetchChannel(String channelId) {
    return _$fetchChannelAsyncAction.run(() => super.fetchChannel(channelId));
  }

  @override
  String toString() {
    return '''
channel: ${channel},
isLoading: ${isLoading},
errorMessage: ${errorMessage}
    ''';
  }
}
