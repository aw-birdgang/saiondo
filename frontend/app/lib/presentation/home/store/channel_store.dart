import 'package:mobx/mobx.dart';
import '../../../domain/entry/channel.dart';
import '../../../domain/repository/channel_repository.dart';

part 'channel_store.g.dart';

class ChannelStore = _ChannelStore with _$ChannelStore;

abstract class _ChannelStore with Store {
  final ChannelRepository _repository;

  _ChannelStore(this._repository);

  @observable
  Channel? channel;

  @observable
  bool isLoading = false;

  @observable
  String? errorMessage;

  @action
  Future<void> fetchChannel(String channelId) async {
    isLoading = true;
    errorMessage = null;
    try {
      channel = await _repository.fetchChannelById(channelId);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }
}
