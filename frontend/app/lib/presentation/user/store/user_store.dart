import 'package:mobx/mobx.dart';

import '../../../domain/entry/assistant.dart';
import '../../../domain/entry/user.dart';
import '../../../domain/repository/user_repository.dart';

part 'user_store.g.dart';

class UserStore = _UserStore with _$UserStore;

abstract class _UserStore with Store {
  final UserRepository _userRepository;

  _UserStore(this._userRepository,) {
    _setupDisposers();
    initUser();
  }

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;

  void _setupDisposers() {
    _disposers = [
      reaction((_) => success, (_) => success = false, delay: 200),
    ];
  }

  @observable
  bool success = false;

  @observable
  ObservableList<User> users = ObservableList<User>();

  @observable
  User? selectedUser;

  @observable
  String? userId;

  @observable
  String? assistantId;

  @observable
  String? channelId;

  @observable
  bool isLoading = false;

  @observable
  User? partnerUser;


  bool get isUserLoaded => !isLoading && selectedUser != null;

  @action
  Future<void> initUser() async {
    isLoading = true;
    try {
      userId = await _userRepository.getUserIdInPreference();
      print('[UserStore] initUser: userId=$userId');
      if (userId == null || userId!.isEmpty) {
        print('[UserStore] userId가 null 또는 빈값입니다.');
        return;
      }
      selectedUser = await _userRepository.fetchUserById(userId!);
      print('[UserStore] selectedUser: ${selectedUser != null ? selectedUser!.toJson() : "null"}');

      List<Assistant> userAssistants = await _userRepository.fetchUserAssistants(userId!);
      if (userAssistants.isNotEmpty) {
        assistantId = userAssistants.first.id;
        channelId = userAssistants.first.channelId;
      }
    } catch (e) {
      print('[UserStore] 유저 정보 로딩 실패: $e');
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> loadUserById(String id) async {
    isLoading = true;
    try {
      selectedUser = await _userRepository.fetchUserById(id);
      if (selectedUser != null) {
        users = ObservableList.of([selectedUser!]);
      }
    }
    catch (e) {
      _userRepository.removeUser();
    }
    finally {
      isLoading = false;
    }
  }

  // 현재 유저 id 반환 (selectedUser 우선, 없으면 users 첫번째)
  String? get currentUserId => selectedUser?.id ?? (users.isNotEmpty ? users.first.id : null);

  // 로그아웃
  @action
  Future<void> removeUser() async {
    selectedUser = null;
    users.clear();
  }

  @action
  Future<void> loadPartnerUser(String partnerUserId) async {
    isLoading = true;
    try {
      partnerUser = await _userRepository.fetchUserById(partnerUserId);
    } finally {
      isLoading = false;
    }
  }

}
