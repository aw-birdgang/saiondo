import 'dart:convert';

import '../../domain/entry/user/persona_profile.dart';
import '../../domain/entry/user/user.dart';
import '../../domain/repository/user/user_repository.dart';
import '../adapter/persona_profile_adapter.dart';
import '../adapter/user_adapter.dart';
import '../network/apis/user_api.dart';
import '../network/dto/user_request.dart';
import '../sharedpref/shared_preference_helper.dart';

class UserRepositoryImpl implements UserRepository {

  final UserApi _userApi;
  final SharedPreferenceHelper _prefs;

  UserRepositoryImpl(this._userApi, this._prefs);

  @override
  Future<List<User>> fetchUsers() async {
    final responseList = await _userApi.fetchUsers();
    return responseList.map((res) => UserAdapter.fromResponse(res)).toList();
  }

  @override
  Future<User> fetchUserById(String id) async {
    final res = await _userApi.fetchUserById(id);
    return UserAdapter.fromResponse(res);
  }

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
    return UserAdapter.fromResponse(jsonDecode(jsonString));
  }

  @override
  Future<void> removeUser() async {
    await _prefs.removeUserInfo();
  }

  @override
  Future<User> updateUser(User user) async {
    // User → UserRequest 변환
    final req = UserRequest(
      id: user.id,
      name: user.name,
      email: user.email,
      gender: user.gender,
      roomId: user.roomId,
    );
    // 서버에 업데이트 요청
    final updatedRes = await _userApi.updateUser(req); // UserResponse 반환
    final updatedUser = UserAdapter.fromResponse(updatedRes); // User로 변환
    await _prefs.saveUserInfo(jsonEncode(updatedUser.toJson())); // 실제 User 저장
    return updatedUser;
  }

  @override
  Future<PersonaProfile?> fetchPersonaProfile(String userId) async {
    final response = await _userApi.fetchPersonaProfile(userId);
    return PersonaProfileAdapter.fromResponse(response);
  }

}
