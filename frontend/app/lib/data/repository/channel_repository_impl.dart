import '../../domain/entry/channel.dart';
import '../../domain/entry/channel_invitation.dart';
import '../../domain/repository/channel_repository.dart';
import '../adapter/channel_invitation_adapter.dart';
import '../network/apis/channel_api.dart';
import '../network/dto/channel_invitation_response.dart';
import 'package:collection/collection.dart';

class ChannelRepositoryImpl implements ChannelRepository {
  final ChannelApi _channelApi;

  ChannelRepositoryImpl(this._channelApi);

  @override
  Future<List<Channel>> fetchAllChannels() async {
    return await _channelApi.fetchAllChannels();
  }

  @override
  Future<Channel> fetchChannelById(String channelId) async {
    return await _channelApi.fetchChannelById(channelId);
  }

  @override
  Future<Channel> createChannel(String userId) async {
    return await _channelApi.createChannel(userId);
  }

  @override
  Future<Channel> joinByInvite(String inviteCode, String userId) async {
    return await _channelApi.joinByInvite(inviteCode, userId);
  }

  @override
  Future<void> leaveChannel(String userId) async {
    await _channelApi.leaveChannel(userId);
  }

  @override
  Future<void> addMember(String channelId, String userId) async {
    await _channelApi.addMember(channelId, userId);
  }

  @override
  Future<Channel?> getCurrentChannel(String userId) async {
    final channels = await fetchAllChannels();
    return channels.firstWhereOrNull(
      (c) => c.members.any((m) => m.userId == userId),
    );
  }

  @override
  Future<String> createInviteCode(String channelId, String userId) async {
    final response = await _channelApi.createInviteCode(channelId, userId);
    return response.inviteCode!;
  }

  @override
  Future<void> acceptInvitation(String channelId, String userId) {
    return _channelApi.acceptInvitation(channelId, userId);
  }

  @override
  Future<void> rejectInvitation(String channelId, String userId) {
    return _channelApi.rejectInvitation(channelId, userId);
  }

  @override
  Future<void> deleteChannel(String channelId) {
    return _channelApi.deleteChannel(channelId);
  }

  @override
  Future<bool> isMember(String channelId, String userId) {
    return _channelApi.isMember(channelId, userId);
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

  @override
  Future<List<Channel>> getAvailableChannels() async {
    final channels = await fetchAllChannels();
    return channels
        .where((c) => c.status == 'ACTIVE' || c.status == 'PENDING')
        .toList();
  }
}