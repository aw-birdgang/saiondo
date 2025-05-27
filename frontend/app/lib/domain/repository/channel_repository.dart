import '../entry/channel.dart';

abstract class ChannelRepository {
  Future<String> createInviteCode(String channelId);
  Future<Channel> fetchChannelById(String channelId);
}