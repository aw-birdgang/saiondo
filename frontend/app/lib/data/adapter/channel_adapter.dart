import '../../domain/entry/channel.dart';
import '../network/dto/channel_response.dart';

class ChannelAdapter {
  static Channel fromResponse(ChannelResponse response) {
    return response.channel;
  }

  static String inviteCodeFromResponse(ChannelResponse response) {
    return response.channel.inviteCode!;
  }
}
