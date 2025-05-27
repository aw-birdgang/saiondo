import '../../domain/repository/channel_repository.dart';
import '../network/apis/channel_api.dart';
import '../../domain/entry/channel.dart';

class ChannelRepositoryImpl implements ChannelRepository {
  final ChannelApi _channelApi;
  ChannelRepositoryImpl(this._channelApi);

  @override
  Future<String> createInviteCode(String channelId) {
    return _channelApi.createInviteCode(channelId);
  }

  @override
  Future<Channel> fetchChannelById(String channelId) {
    return _channelApi.fetchChannelById(channelId);
  }
}