import '../entry/channel.dart';
import '../entry/channel_invitation.dart';

abstract class ChannelRepository {
  Future<List<Channel>> getAvailableChannels();
  Future<List<Channel>> fetchAllChannels();

  Future<Channel?> getCurrentChannel(String userId);
  Future<Channel> fetchChannelById(String channelId);

  Future<Channel> createChannel(String userId);
  Future<String> createInviteCode(String channelId, String userId);
  Future<void> deleteChannel(String channelId);

  Future<void> acceptInvitation(String channelId, String userId);
  Future<void> rejectInvitation(String channelId, String userId);
  Future<void> leaveChannel(String userId);

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