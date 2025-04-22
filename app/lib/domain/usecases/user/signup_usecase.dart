import 'package:app/domain/repositories/user/user_repository.dart';
import 'package:app/domain/entities/user/user.dart';

class SignUpParams {
  final String email;
  final String password;
  final String name;

  SignUpParams({
    required this.email,
    required this.password,
    required this.name,
  });
}

class SignUpUseCase {
  final UserRepository _userRepository;

  SignUpUseCase(this._userRepository);

  Future<User?> call({required SignUpParams params}) async {
    return await _userRepository.signup(
      params.email,
      params.password,
      params.name,
    );
  }
} 