import '../../../../domain/entry/user/user.dart';

abstract class UserDataSource {
  Future<List<User>> fetchUsers();
  Future<User> fetchUserById(String id);
  Future<List<dynamic>> fetchUserRooms(String id);
  Future<User> updateUser(User user);
}