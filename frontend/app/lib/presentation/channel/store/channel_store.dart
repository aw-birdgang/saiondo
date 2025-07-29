import 'package:mobx/mobx.dart';

import '../../../domain/entry/channel.dart';
import '../../../domain/repository/channel_repository.dart';

part 'channel_store.g.dart';

class ChannelStore = _ChannelStore with _$ChannelStore;

abstract class _ChannelStore with Store {
  final ChannelRepository _channelRepository;

  _ChannelStore(this._channelRepository);

  @observable
  ObservableList<Channel> availableChannels = ObservableList<Channel>();

  @observable
  ObservableList<Channel> userChannels = ObservableList<Channel>();

  @observable
  Channel? currentChannel;

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @observable
  String? successMessage;

  /// 전체 채널 목록 조회
  @action
  Future<void> fetchAllChannels() async {
    isLoading = true;
    error = null;
    try {
      final result = await _channelRepository.fetchAllChannels();
      availableChannels = ObservableList.of(result);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 정보 조회
  @action
  Future<void> fetchChannel(String channelId) async {
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      currentChannel = await _channelRepository.fetchChannelById(channelId);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 정보 조회
  @action
  Future<void> fetchChannelsByUserId(String userId) async {
    print('[ChannelStore] request > fetchChannelsByUserId > userId :: $userId');
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      final channelsResult = await _channelRepository
          .fetchChannelsByUserId(userId); // Channels 객체 반환
      userChannels = ObservableList.of(channelsResult.channels);
      currentChannel = userChannels.isNotEmpty ? userChannels.first : null;
      print(
          '[ChannelStore] response > fetchChannelsByUserId > userChannels :: $userChannels');
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> fetchCurrentChannel(String userId) async {
    isLoading = true;
    error = null;
    try {
      final result = await _channelRepository.getCurrentChannel(userId);
      currentChannel = result;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 생성
  @action
  Future<Channel?> createChannel(String userId) async {
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      final channel = await _channelRepository.createChannel(userId);
      currentChannel = channel;
      successMessage = '채널이 생성되었습니다!';
      return channel;
    } catch (e) {
      error = e.toString();
      return null;
    } finally {
      isLoading = false;
    }
  }

  /// 초대코드로 채널 참여
  @action
  Future<bool> joinByInvite(String inviteCode, String userId) async {
    isLoading = true;
    error = null;
    try {
      currentChannel =
          await _channelRepository.joinByInvite(inviteCode, userId);
      successMessage = '채널에 참여하였습니다!';
      return true;
    } catch (e) {
      error = e.toString();
      return false;
    } finally {
      isLoading = false;
    }
  }

  /// 채널 멤버 추가 (MEMBER로)
  @action
  Future<void> addMember(String channelId, String userId) async {
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      await _channelRepository.addMember(channelId, userId);
      successMessage = '채널에 멤버가 추가되었습니다!';
      // 멤버 추가 후 채널 정보 갱신
      await fetchChannel(channelId);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 초대 코드 생성
  @action
  Future<String?> createInviteCode(String channelId, String userId) async {
    isLoading = true;
    error = null;
    successMessage = null;
    try {
      final code = await _channelRepository.createInviteCode(channelId, userId);
      successMessage = '초대 코드가 생성되었습니다!';
      return code;
    } catch (e) {
      error = e.toString();
      return null;
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> fetchAvailableChannels() async {
    isLoading = true;
    error = null;
    try {
      final result = await _channelRepository.getAvailableChannels();
      availableChannels = ObservableList.of(result);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }

  /// 채널 나가기
  @action
  Future<void> leaveChannel(String userId) async {
    isLoading = true;
    error = null;
    try {
      await _channelRepository.leaveChannel(userId);
      currentChannel = null;
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }
}
