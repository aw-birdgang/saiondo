import 'package:mobx/mobx.dart';
import '../../../domain/entry/channel.dart';
import '../../../domain/repository/channel_repository.dart';
import '../../../di/service_locator.dart';

part 'channel_store.g.dart';

class ChannelStore = _ChannelStore with _$ChannelStore;

abstract class _ChannelStore with Store {
  final ChannelRepository _repository;
  _ChannelStore(this._repository);

  @observable
  ObservableList<Channel> channels = ObservableList<Channel>();

  @observable
  Channel? channel;

  @observable
  bool isLoading = false;

  @observable
  String? errorMessage;

  @observable
  String? successMessage;

  /// 전체 채널 목록 조회
  @action
  Future<void> fetchAllChannels() async {
    isLoading = true;
    errorMessage = null;
    try {
      final result = await _repository.fetchAllChannels();
      channels = ObservableList.of(result);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 정보 조회
  @action
  Future<void> fetchChannel(String channelId) async {
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      channel = await _repository.fetchChannelById(channelId);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 1:1 채널 생성(이미 있으면 반환)
  @action
  Future<void> createOrGetChannel(String user1Id, String user2Id) async {
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      channel = await _repository.createOrGetChannel(user1Id, user2Id);
      successMessage = '채널이 생성되었습니다!';
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 멤버 추가 (초대 수락 등)
  @action
  Future<void> addMember(String channelId, String userId) async {
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      await _repository.addMember(channelId, userId);
      successMessage = '채널에 멤버가 추가되었습니다!';
      // 멤버 추가 후 채널 정보 갱신
      await fetchChannel(channelId);
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 초대 코드 생성
  @action
  Future<String?> createInviteCode(String channelId, String userId) async {
    isLoading = true;
    errorMessage = null;
    successMessage = null;
    try {
      final code = await _repository.createInviteCode(channelId, userId);
      successMessage = '초대 코드가 생성되었습니다!';
      return code;
    } catch (e) {
      errorMessage = e.toString();
      return null;
    } finally {
      isLoading = false;
    }
  }
}