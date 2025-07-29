import '../../../domain/entry/channel.dart';

class ChannelResponse {
  final String id;
  final String inviteCode;
  final Channel channel;

  ChannelResponse(
      {required this.id, required this.inviteCode, required this.channel});

  factory ChannelResponse.fromJson(Map<String, dynamic> json) {
    // API 응답이 {"channel": {...}} 형태일 때
    if (json.containsKey('channel')) {
      return ChannelResponse(
        id: json['id'],
        inviteCode: json['inviteCode'],
        channel: Channel.fromJson(json['channel']),
      );
    }
    // API 응답이 곧바로 채널 정보일 때
    return ChannelResponse(
      id: json['id'],
      inviteCode: json['inviteCode'],
      channel: Channel.fromJson(json),
    );
  }
}
