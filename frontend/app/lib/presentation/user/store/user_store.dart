import 'package:mobx/mobx.dart';

import '../../../domain/entry/user/persona_profile.dart';
import '../../../domain/entry/user/user.dart';
import '../../../domain/repository/user/user_repository.dart';

part 'user_store.g.dart';

class UserStore = _UserStore with _$UserStore;

abstract class _UserStore with Store {
  final UserRepository _userRepository;

  _UserStore(this._userRepository);

  @observable
  ObservableList<User> users = ObservableList<User>();

  @observable
  User? selectedUser;

  @observable
  List<dynamic> userRooms = [];

  @observable
  PersonaProfile? personaProfile;

  @action
  Future<void> loadUsers() async {
    final fetchedUsers = await _userRepository.fetchUsers();
    users = ObservableList.of(fetchedUsers);
  }

  @action
  Future<void> loadUserById(String id) async {
    selectedUser = await _userRepository.fetchUserById(id);
  }

  @action
  Future<void> loadUserRooms(String id) async {
    userRooms = await _userRepository.fetchUserRooms(id);
  }

  @action
  Future<void> loadPersonaProfile(String userId) async {
    personaProfile = await _userRepository.fetchPersonaProfile(userId);
  }
}
