import 'package:mobx/mobx.dart';

import '../../../domain/repository/channel_repository.dart';

part 'invite_code_store.g.dart';

class InviteCodeStore = _InviteCodeStore with _$InviteCodeStore;

abstract class _InviteCodeStore with Store {
  final ChannelRepository _repository;
  _InviteCodeStore(this._repository);

  @observable
  String? inviteCode;

  @observable
  bool isLoading = false;

  @action
  Future<void> generateInviteCode(String channelId) async {
    isLoading = true;
    try {
      inviteCode = await _repository.createInviteCode(channelId);
    } finally {
      isLoading = false;
    }
  }
}
