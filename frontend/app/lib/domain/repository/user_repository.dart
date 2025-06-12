import '../entry/assistant.dart';
import '../entry/persona_profile.dart';
import '../entry/user.dart';

abstract class UserRepository {
  Future<List<User>> fetchUsers();
  Future<User> fetchUserById(String id);
  //
  Future<List<Assistant>> fetchUserAssistants(String userId);
  //
  Future<List<PersonaProfile>> fetchPersonaProfiles(String userId);
  Future<PersonaProfile> createPersonaProfile(String userId, PersonaProfile profile);
  Future<PersonaProfile> updatePersonaProfile(String userId, PersonaProfile profile);
  Future<void> deletePersonaProfile(String userId, String categoryCodeId);
  //
  Future<User?> getUser();
  Future<void> removeUser();
  //
  Future<User> updateUser(User user);

  // 로컬에 유저 정보 저장/조회/삭제
  Future<void> saveUserPreference(User user);
  Future<String?> getUserIdInPreference();

}