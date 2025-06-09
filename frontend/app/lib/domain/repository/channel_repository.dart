import '../entry/channel.dart';

abstract class ChannelRepository {
  Future<String> createInviteCode(String channelId);
  Future<Channel> fetchChannelById(String channelId);
  Future<Channel> createChannel(String user1Id, String user2Id);
  Future<bool> isMember(String channelId, String userId);
  Future<void> addMember(String channelId, String userId);
  Future<void> cleanupEmptyChannels();
  Future<void> createInvitation(String channelId, String inviteeId);
  Future<bool> hasPendingInvitation(String channelId, String inviteeId);
  Future<void> respondInvitation(String invitationId, String response);
}