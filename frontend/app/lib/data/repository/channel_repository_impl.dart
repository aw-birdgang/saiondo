import '../../domain/entry/channel.dart';
import '../../domain/entry/channel_invitation.dart';
import '../../domain/repository/channel_repository.dart';
import '../adapter/channel_adapter.dart';
import '../adapter/channel_invitation_adapter.dart';
import '../network/apis/channel_api.dart';
import '../network/dto/channel_invitation_response.dart';

class ChannelRepositoryImpl implements ChannelRepository {
  final ChannelApi _channelApi;

  ChannelRepositoryImpl(this._channelApi);

  @override
  Future<List<Channel>> fetchAllChannels() async {
    final response = await _channelApi.fetchAllChannels();
    return response.channels;
  }

  @override
  Future<Channel> fetchChannelById(String channelId) async {
    final response = await _channelApi.fetchChannelById(channelId);
    return ChannelAdapter.fromResponse(response);
  }

  @override
  Future<Channel> createOrGetChannel(String user1Id, String user2Id) async {
    final response = await _channelApi.createOrGetChannel(user1Id, user2Id);
    return ChannelAdapter.fromResponse(response);
  }

  @override
  Future<String> createInviteCode(String channelId, String userId) async {
    final response = await _channelApi.createInviteCode(channelId, userId);
    return response.inviteCode!;
  }

  @override
  Future<void> acceptInvitation(String channelId) {
    return _channelApi.acceptInvitation(channelId);
  }

  @override
  Future<void> rejectInvitation(String channelId) {
    return _channelApi.rejectInvitation(channelId);
  }

  @override
  Future<void> deleteChannel(String channelId) {
    return _channelApi.deleteChannel(channelId);
  }

  @override
  Future<Channel> joinByInvite(String inviteCode, String userId) async {
    final response = await _channelApi.joinByInvite(inviteCode, userId);
    return ChannelAdapter.fromResponse(response);
  }

  @override
  Future<bool> isMember(String channelId, String userId) {
    return _channelApi.isMember(channelId, userId);
  }

  @override
  Future<void> addMember(String channelId, String userId) {
    return _channelApi.addMember(channelId, userId);
  }

  @override
  Future<void> cleanupEmptyChannels() {
    return _channelApi.cleanupEmptyChannels();
  }

  @override
  Future<ChannelInvitation> createInvitation(
      String channelId, String inviterId, String inviteeId) async {
    final response = await _channelApi.createInvitation(channelId, inviterId, inviteeId);
    return ChannelInvitationAdapter.fromResponse(response);
  }

  @override
  Future<bool> hasPendingInvitation(String channelId, String inviteeId) {
    return _channelApi.hasPendingInvitation(channelId, inviteeId);
  }

  @override
  Future<void> respondInvitation(String invitationId, String response) {
    return _channelApi.respondInvitation(invitationId, response);
  }

  @override
  Future<List<ChannelInvitation>> fetchInvitationsForUser(String userId) async {
    final response = await _channelApi.fetchInvitationsForUser(userId);
    return response
        .map((e) => ChannelInvitationAdapter.fromResponse(
            e as ChannelInvitationResponse))
        .toList();
  }
}