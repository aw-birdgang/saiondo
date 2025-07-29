import '../../../domain/entry/channel.dart';

class ChannelListResponse {
  final List<Channel> channels;

  ChannelListResponse({required this.channels});

  factory ChannelListResponse.fromJson(List<dynamic> jsonList) {
    return ChannelListResponse(
      channels: jsonList.map((e) => Channel.fromJson(e)).toList(),
    );
  }
}
