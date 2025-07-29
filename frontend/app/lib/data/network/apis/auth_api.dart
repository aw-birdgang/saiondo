import 'package:dio/dio.dart';

import '../../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';

class AuthApi {
  final DioClient _dioClient;

  AuthApi(this._dioClient);

  Future<Map<String, dynamic>> login(String email, String password) async {
    // print('[AuthApi] login 요청 email: $email, password: $password');
    try {
      final response = await _dioClient.dio.post(
        Endpoints.authLogin,
        data: {
          'email': email,
          'password': password,
        },
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
      );
      // Dio는 이미 JSON 파싱된 Map을 반환
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? e.message ?? '로그인 실패';
      throw Exception('로그인 실패: $message');
    }
  }

  Future<Map<String, dynamic>> register(
      String email, String password, String name, String gender) async {
    try {
      final response = await _dioClient.dio.post(
        Endpoints.authRegister,
        data: {
          'email': email,
          'password': password,
          'name': name,
          'gender': gender,
        },
        options: Options(
          headers: {'Content-Type': 'application/json'},
        ),
      );
      return response.data as Map<String, dynamic>;
    } on DioException catch (e) {
      final message = e.response?.data?['message'] ?? e.message ?? '회원가입 실패';
      throw Exception('회원가입 실패: $message');
    }
  }
}
