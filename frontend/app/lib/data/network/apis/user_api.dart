import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/persona_profile_response.dart';
import '../dto/user_request.dart';
import '../rest_client.dart';
import '../dto/user_response.dart';
import '../dto/persona_profile_request.dart';

class UserApi {
  final DioClient _dioClient;
  final RestClient _restClient;
  UserApi(this._dioClient, this._restClient);

  Future<List<UserResponse>> fetchUsers() async {
    final response = await _dioClient.dio.get(Endpoints.users);
    return (response.data as List).map((e) => UserResponse.fromJson(e)).toList();
  }

  Future<UserResponse> fetchUserById(String id) async {
    print('[UserApi] fetchUserById 요청: $id');
    final response = await _dioClient.dio.get(Endpoints.userById(id));
    return UserResponse.fromJson(response.data);
  }

  Future<List<dynamic>> fetchUserRooms(String id) async {
    final response = await _dioClient.dio.get(Endpoints.userRooms(id));
    return response.data as List;
  }

  Future<UserResponse> updateUser(UserRequest user) async {
    final response = await _dioClient.dio.patch(
      Endpoints.userById(user.id),
      data: user.toJson(),
    );
    return UserResponse.fromJson(response.data);
  }

  Future<PersonaProfileResponse> fetchPersonaProfile(String userId) async {
    final response = await _dioClient.dio.get(Endpoints.personaProfile(userId));
    return PersonaProfileResponse.fromJson(response.data);
  }

  Future<List<PersonaProfileResponse>> fetchPersonaProfiles(String userId) async {
    final url = Endpoints.personaProfiles(userId);
    print('[UserApi] fetchPersonaProfiles 요청 URL: $url');
    final response = await _dioClient.dio.get(url);
    return (response.data as List)
        .map((e) => PersonaProfileResponse.fromJson(e))
        .toList();
  }

  Future<PersonaProfileResponse> createPersonaProfile(String userId, PersonaProfileRequest req) async {
    final response = await _dioClient.dio.post(
      Endpoints.createPersonaProfile(userId),
      data: req.toJson(),
    );
    return PersonaProfileResponse.fromJson(response.data);
  }

  Future<PersonaProfileResponse> updatePersonaProfile(String userId, String categoryCodeId, PersonaProfileRequest req) async {
    final response = await _dioClient.dio.patch(
      Endpoints.updatePersonaProfile(userId, categoryCodeId),
      data: req.toJson(),
    );
    return PersonaProfileResponse.fromJson(response.data);
  }
}