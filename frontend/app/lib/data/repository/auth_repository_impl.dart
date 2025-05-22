import '../../domain/repository/auth_repository.dart';
import '../network/apis/auth_api.dart';
import '../sharedpref/shared_preference_helper.dart';

class AuthRepositoryImpl implements AuthRepository {
  final AuthApi _authApi;
  final SharedPreferenceHelper _sharedPrefsHelper;

  AuthRepositoryImpl(this._authApi, this._sharedPrefsHelper);

  @override
  Future<Map<String, dynamic>> login(String email, String password) async {
    final result = await _authApi.login(email, password);

    // 로그인 성공 시 토큰/유저 정보 저장
    final accessToken = result['accessToken'] as String?;
    final user = result['user'] as Map<String, dynamic>?;
    final userId = user?['id'] as String?;

    if (accessToken != null) {
      await _sharedPrefsHelper.saveAccessToken(accessToken);
    }
    if (userId != null) {
      await _sharedPrefsHelper.saveUserId(userId);
    }
    return result;
  }

  @override
  Future<Map<String, dynamic>> register(String email, String password, String name, String gender) async {
    final result = await _authApi.register(email, password, name, gender);

    // 회원가입 성공 시 유저 정보 저장 (accessToken이 있다면 토큰도 저장)
    final user = result['user'] as Map<String, dynamic>?;
    final userId = user?['id'] as String?;
    final accessToken = result['accessToken'] as String?;

    if (userId != null) {
      await _sharedPrefsHelper.saveUserId(userId);
    }
    if (accessToken != null) {
      await _sharedPrefsHelper.saveAccessToken(accessToken);
    }

    return result;
  }

  @override
  Future<String?> getAccessToken() => _sharedPrefsHelper.getAccessToken();

  @override
  Future<String?> getUserId() => _sharedPrefsHelper.getUserId();

  @override
  Future<void> logout() async {
    await _sharedPrefsHelper.removeAccessToken();
    await _sharedPrefsHelper.removeUserId();
    await _sharedPrefsHelper.removeUserInfo();
  }
}