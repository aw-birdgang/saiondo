import '../../../data/network/model/user.dart';

abstract class UserRepository {
  // 서버에서 유저 목록/단건 조회
  Future<List<User>> fetchUsers();
  Future<User> fetchUserById(String id);

  // 서버에서 유저의 room 목록 조회
  Future<List<dynamic>> fetchUserRooms(String id);

  // 로컬에 유저 정보 저장/조회/삭제
  Future<void> saveUser(User user);
  Future<User?> getUser();
  Future<void> removeUser();

  // (선택) 유저 정보 업데이트
  Future<User> updateUser(User user);
}
