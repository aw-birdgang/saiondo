import '../../domain/repository/channel_repository.dart';
import '../network/apis/channel_api.dart';

class ChannelRepositoryImpl implements ChannelRepository {
  final ChannelApi _channelApi;
  ChannelRepositoryImpl(this._channelApi);

  Future<String> createInviteCode(String channelId) {
    return _channelApi.createInviteCode(channelId);
  }
}