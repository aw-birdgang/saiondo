import 'dart:convert';

import '../../domain/repository/user/user_repository.dart';
import '../sharedpref/shared_preference_helper.dart';
import '../network/apis/user_api.dart';
import '../network/model/user.dart';

class UserRepositoryImpl implements UserRepository {

  final UserApi _userApi;
  final SharedPreferenceHelper _prefs;

  UserRepositoryImpl(this._userApi, this._prefs);

  @override
  Future<List<User>> fetchUsers() => _userApi.fetchUsers();

  @override
  Future<User> fetchUserById(String id) => _userApi.fetchUserById(id);

  @override
  Future<List<dynamic>> fetchUserRooms(String id) => _userApi.fetchUserRooms(id);

  @override
  Future<void> saveUser(User user) async {
    await _prefs.saveUserInfo(jsonEncode(user.toJson()));
  }

  @override
  Future<User?> getUser() async {
    final jsonString = await _prefs.getUserInfo();
    if (jsonString == null) return null;
    return User.fromJson(jsonDecode(jsonString));
  }

  @override
  Future<void> removeUser() async {
    await _prefs.removeUserInfo();
  }

  @override
  Future<User> updateUser(User user) async {
    // 서버에 PATCH/PUT 요청 후, 결과를 로컬에도 반영
    final updated = await _userApi.updateUser(user);
    await saveUser(updated);
    return updated;
  }
}
