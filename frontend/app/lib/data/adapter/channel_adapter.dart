import '../../domain/entry/channel.dart';
import '../network/dto/channel_response.dart';

class ChannelAdapter {
  static Channel fromResponse(dynamic response) {
    // response가 ChannelResponse, Map, 혹은 Channel 자체일 수 있음
    if (response is Channel) return response;
    if (response is Map<String, dynamic>) return Channel.fromJson(response);
    if (response is ChannelResponse) {
      // ChannelResponse에 toJson()이 없다면, channel 필드를 바로 사용
      return response.channel;
    }
    throw Exception('Unknown response type');
  }

  static String inviteCodeFromResponse(ChannelResponse response) {
    return response.channel.inviteCode!;
  }
}
