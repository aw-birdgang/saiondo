import '../entry/channel.dart';
import '../entry/channel_invitation.dart';

abstract class ChannelRepository {
  Future<List<Channel>> fetchAllChannels();
  Future<Channel> fetchChannelById(String channelId);
  Future<Channel> createOrGetChannel(String user1Id, String user2Id);
  Future<String> createInviteCode(String channelId, String userId);
  Future<void> acceptInvitation(String channelId);
  Future<void> rejectInvitation(String channelId);
  Future<void> deleteChannel(String channelId);
  Future<Channel> joinByInvite(String inviteCode, String userId);
  Future<bool> isMember(String channelId, String userId);
  Future<void> addMember(String channelId, String userId);
  Future<void> cleanupEmptyChannels();

  /// 초대장 생성 (초대장 객체 반환)
  Future<ChannelInvitation> createInvitation(
      String channelId, String inviterId, String inviteeId);

  Future<bool> hasPendingInvitation(String channelId, String inviteeId);
  Future<void> respondInvitation(String invitationId, String response);

  /// 특정 유저의 초대장 목록 조회
  Future<List<ChannelInvitation>> fetchInvitationsForUser(String userId);
}