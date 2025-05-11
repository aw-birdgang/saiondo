abstract class AuthRepository {
  Future<Map<String, dynamic>> login(String email, String password);
  Future<Map<String, dynamic>> register(String email, String password, String name, String gender);

  // 추가: 저장된 값 불러오기
  Future<String?> getAccessToken();
  Future<String?> getUserId();
  
  Future<void> logout();
}