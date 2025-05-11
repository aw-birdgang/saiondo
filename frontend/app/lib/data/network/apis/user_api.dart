import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../model/user.dart';
import '../rest_client.dart';

class UserApi {
  final DioClient _dioClient;
  final RestClient _restClient;
  UserApi(this._dioClient, this._restClient);

  Future<List<User>> fetchUsers() async {
    final response = await _dioClient.dio.get(Endpoints.users);
    return (response.data as List).map((e) => User.fromJson(e)).toList();
  }

  Future<User> fetchUserById(String id) async {
    final response = await _dioClient.dio.get(Endpoints.userById(id));
    return User.fromJson(response.data);
  }

  Future<List<dynamic>> fetchUserRooms(String id) async {
    final response = await _dioClient.dio.get(Endpoints.userRooms(id));
    return response.data as List;
  }

  Future<User> updateUser(User user) async {
    final response = await _dioClient.dio.patch(
      Endpoints.userById(user.id),
      data: user.toJson(),
    );
    return User.fromJson(response.data);
  }
}