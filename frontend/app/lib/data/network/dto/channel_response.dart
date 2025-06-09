import '../../../domain/entry/channel.dart';

class ChannelResponse {
  final Channel channel;

  ChannelResponse({required this.channel});

  factory ChannelResponse.fromJson(Map<String, dynamic> json) {
    // API 응답이 {"channel": {...}} 형태일 때
    if (json.containsKey('channel')) {
      return ChannelResponse(channel: Channel.fromJson(json['channel']));
    }
    // API 응답이 곧바로 채널 정보일 때
    return ChannelResponse(channel: Channel.fromJson(json));
  }
}