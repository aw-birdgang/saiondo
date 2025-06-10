import 'package:mobx/mobx.dart';

import '../../../domain/entry/channel_invitation.dart';
import '../../../domain/repository/channel_repository.dart';

part 'channel_invitation_store.g.dart';

class ChannelInvitationStore = _ChannelInvitationStore with _$ChannelInvitationStore;

abstract class _ChannelInvitationStore with Store {
  final ChannelRepository _repository;
  _ChannelInvitationStore(this._repository);

  @observable
  ObservableList<ChannelInvitation> invitations = ObservableList<ChannelInvitation>();

  @observable
  bool isLoading = false;

  @observable
  String? errorMessage;

  // --- 초대 코드 관련 상태 ---
  @observable
  String? inviteCode;

  @observable
  bool isLoadingInviteCode = false;

  @observable
  String? inviteCodeError;

  // --- 초대 코드 발급 액션 ---
  @action
  Future<void> generateInviteCode(String channelId, String userId) async {
    isLoadingInviteCode = true;
    inviteCodeError = null;
    try {
      inviteCode = await _repository.createInviteCode(channelId, userId);
    } catch (e) {
      inviteCodeError = e.toString();
      inviteCode = null;
    } finally {
      isLoadingInviteCode = false;
    }
  }

  @action
  Future<void> fetchInvitations(String userId) async {
    isLoading = true;
    errorMessage = null;
    try {
      final result = await _repository.fetchInvitationsForUser(userId);
      invitations = ObservableList.of(result);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> respondToInvitation(String invitationId, bool accept, String userId) async {
    isLoading = true;
    errorMessage = null;
    try {
      await _repository.respondInvitation(invitationId, accept ? 'accepted' : 'declined');
      await fetchInvitations(userId);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }
}