import '../../repository/auth_repository.dart';

class RegisterUseCase {
  final AuthRepository _authRepository;

  RegisterUseCase(this._authRepository);

  Future<Map<String, dynamic>> call(
      String email, String password, String name, String gender) {
    return _authRepository.register(email, password, name, gender);
  }
}
