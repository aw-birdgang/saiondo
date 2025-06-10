import '../../domain/entry/channel_invitation.dart';
import '../network/dto/channel_invitation_response.dart';

class ChannelInvitationAdapter {
  static ChannelInvitation fromResponse(ChannelInvitationResponse response) {
    return response.toDomain();
  }

  static ChannelInvitationStatus _statusFromString(String status) {
    switch (status.toLowerCase()) {
      case 'pending':
        return ChannelInvitationStatus.pending;
      case 'accepted':
        return ChannelInvitationStatus.accepted;
      case 'declined':
        return ChannelInvitationStatus.declined;
      default:
        return ChannelInvitationStatus.pending;
    }
  }
}
