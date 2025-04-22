import 'package:app/domain/repositories/user/user_repository.dart';

class ResetPasswordUseCase {
  final UserRepository _userRepository;

  ResetPasswordUseCase(this._userRepository);

  Future<void> call({required String email}) async {
    return await _userRepository.resetPassword(email);
  }
} 