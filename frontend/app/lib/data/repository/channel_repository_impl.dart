import '../../domain/entry/channel.dart';
import '../../domain/repository/channel_repository.dart';
import '../adapter/channel_adapter.dart';
import '../network/apis/channel_api.dart';

class ChannelRepositoryImpl implements ChannelRepository {
  final ChannelApi _channelApi;

  ChannelRepositoryImpl(this._channelApi);

  @override
  Future<String> createInviteCode(String channelId) async {
    final response = await _channelApi.createInviteCode(channelId);
    return ChannelAdapter.inviteCodeFromResponse(response);
  }

  @override
  Future<Channel> fetchChannelById(String channelId) async {
    final response = await _channelApi.fetchChannelById(channelId);
    return ChannelAdapter.fromResponse(response);
  }

  @override
  Future<Channel> createChannel(String user1Id, String user2Id) async {
    final response = await _channelApi.createChannel(user1Id, user2Id);
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
  Future<void> createInvitation(String channelId, String inviteeId) {
    return _channelApi.createInvitation(channelId, inviteeId);
  }

  @override
  Future<bool> hasPendingInvitation(String channelId, String inviteeId) {
    return _channelApi.hasPendingInvitation(channelId, inviteeId);
  }

  @override
  Future<void> respondInvitation(String invitationId, String response) {
    return _channelApi.respondInvitation(invitationId, response);
  }
}