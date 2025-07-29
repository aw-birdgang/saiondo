enum ChannelInvitationStatus { pending, accepted, declined }

class ChannelInvitation {
  final String id;
  final String channelId;
  final String inviterId;
  final String inviteeId;
  final ChannelInvitationStatus status;

  ChannelInvitation({
    required this.id,
    required this.channelId,
    required this.inviterId,
    required this.inviteeId,
    required this.status,
  });

  factory ChannelInvitation.fromJson(Map<String, dynamic> json) {
    return ChannelInvitation(
      id: json['id'] as String,
      channelId: json['channelId'] as String,
      inviterId: json['inviterId'] as String,
      inviteeId: json['inviteeId'] as String,
      status: ChannelInvitationStatus.values.firstWhere(
        (e) => e.name == (json['status'] as String).toLowerCase(),
        orElse: () => ChannelInvitationStatus.pending,
      ),
    );
  }

  Map<String, dynamic> toJson() => {
        'id': id,
        'channelId': channelId,
        'inviterId': inviterId,
        'inviteeId': inviteeId,
        'status': status.name,
      };
}
