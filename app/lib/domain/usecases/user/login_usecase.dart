import 'package:app/domain/entities/user/user.dart';
import '../../../core/domain/usecase/use_case.dart';
import '../../repositories/user/user_repository.dart';

class LoginParams {
  final String username;  // email로 사용될 필드
  final String password;

  LoginParams({
    required this.username,
    required this.password,
  });

  factory LoginParams.fromJson(Map<String, dynamic> json) {
    return LoginParams(
      username: json['username'] as String,
      password: json['password'] as String,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'username': username,
      'password': password,
    };
  }
}

class LoginUseCase implements UseCase<User?, LoginParams> {
  final UserRepository _userRepository;

  LoginUseCase(this._userRepository);

  @override
  Future<User?> call({required LoginParams params}) async {
    return _userRepository.login(params);
  }
}