import 'channel.dart';

class Channels {
  final List<Channel> channels;

  Channels({required this.channels});

  factory Channels.fromJson(List<dynamic> jsonList) => Channels(
        channels: jsonList
            .map((item) => Channel.fromJson(item as Map<String, dynamic>))
            .toList(),
      );
}
