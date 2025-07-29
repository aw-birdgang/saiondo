import '../../repository/auth_repository.dart';

class LoginUseCase {
  final AuthRepository _authRepository;

  LoginUseCase(this._authRepository);

  Future<Map<String, dynamic>> call(String email, String password) {
    return _authRepository.login(email, password);
  }
}
