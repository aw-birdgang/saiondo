import 'dart:convert';

import 'package:app/domain/entry/assistant.dart';

import '../../domain/entry/persona_profile.dart';
import '../../domain/entry/user.dart';
import '../../domain/repository/user_repository.dart';
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
    print('[UserRepositoryImpl] fetchUserById: res = ${res.toJson()}');
    return UserAdapter.fromResponse(res);
  }

  @override
  Future<List<Assistant>> fetchUserAssistants(String userId) => _userApi.fetchUserAssistants(userId);

  @override
  Future<void> saveUserPreference(User user) async {
    await _prefs.saveUserInfo(jsonEncode(user.toJson()));
  }

  @override
  Future<String?> getUserIdInPreference() async {
    return await _prefs.getUserId();
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
      assistantId: user.assistantId,
    );
    // 서버에 업데이트 요청
    final updatedRes = await _userApi.updateUser(req); // UserResponse 반환
    final updatedUser = UserAdapter.fromResponse(updatedRes); // User로 변환
    await _prefs.saveUserInfo(jsonEncode(updatedUser.toJson())); // 실제 User 저장
    return updatedUser;
  }

  @override
  Future<List<PersonaProfile>> fetchPersonaProfiles(String userId) async {
    final responseList = await _userApi.fetchPersonaProfiles(userId);
    return responseList
        .map((res) => PersonaProfileAdapter.fromResponse(res))
        .whereType<PersonaProfile>()
        .toList();
  }

  @override
  Future<PersonaProfile> createPersonaProfile(String userId, PersonaProfile profile) async {
    final requestDto = PersonaProfileAdapter.toRequest(profile);
    final response = await _userApi.createPersonaProfile(userId, requestDto);
    return PersonaProfileAdapter.fromResponse(response)!;
  }

  @override
  Future<PersonaProfile> updatePersonaProfile(String userId, PersonaProfile profile) async {
    final requestDto = PersonaProfileAdapter.toRequest(profile);
    final response = await _userApi.updatePersonaProfile(userId, profile.categoryCodeId, requestDto);
    return PersonaProfileAdapter.fromResponse(response)!;
  }

  @override
  Future<void> deletePersonaProfile(String userId, String categoryCodeId) async {
    await _userApi.deletePersonaProfile(userId, categoryCodeId);
  }

}
