import 'package:mobx/mobx.dart';

import '../../../domain/entry/user/persona_profile.dart';
import '../../../domain/entry/user/user.dart';
import '../../../domain/repository/user/user_repository.dart';
import '../../auth/store/auth_store.dart';

part 'user_store.g.dart';

class UserStore = _UserStore with _$UserStore;

abstract class _UserStore with Store {
  final UserRepository _userRepository;

  _UserStore(this._userRepository) {
    initUser();
  }

  @observable
  ObservableList<User> users = ObservableList<User>();

  @observable
  User? selectedUser;

  @observable
  String? userId;

  @observable
  String? roomId;

  @observable
  List<dynamic> userRooms = [];

  @observable
  bool isLoading = false;

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

      userRooms = await _userRepository.fetchUserRooms(userId!);
      if (userRooms.isNotEmpty) {
        roomId = userRooms.first['id'];
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
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> loadUserRooms(String id) async {
    isLoading = true;
    try {
      userRooms = await _userRepository.fetchUserRooms(id);
    } finally {
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
    userRooms = [];
  }
}
