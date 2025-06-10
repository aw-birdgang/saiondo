import '../../../domain/entry/channel_invitation.dart';

class ChannelInvitationResponse {
  final String id;
  final String channelId;
  final String inviterId;
  final String inviteeId;
  final String status;

  ChannelInvitationResponse({
    required this.id,
    required this.channelId,
    required this.inviterId,
    required this.inviteeId,
    required this.status,
  });

  factory ChannelInvitationResponse.fromJson(Map<String, dynamic> json) {
    return ChannelInvitationResponse(
      id: json['id'] as String,
      channelId: json['channelId'] as String,
      inviterId: json['inviterId'] as String,
      inviteeId: json['inviteeId'] as String,
      status: json['status'] as String,
    );
  }

  // 도메인 모델로 변환
  ChannelInvitation toDomain() {
    return ChannelInvitation(
      id: id,
      channelId: channelId,
      inviterId: inviterId,
      inviteeId: inviteeId,
      status: ChannelInvitationStatus.values.firstWhere(
        (e) => e.name == status.toLowerCase(),
        orElse: () => ChannelInvitationStatus.pending,
      ),
    );
  }
}
