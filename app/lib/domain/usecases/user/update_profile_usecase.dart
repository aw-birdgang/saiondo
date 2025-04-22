import 'package:dartz/dartz.dart';
import 'package:app/domain/core/failures.dart';
import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/repositories/user/user_repository.dart';

class UpdateProfileParams {
  final User user;
  const UpdateProfileParams(this.user);
}

class UpdateProfileUseCase {
  final UserRepository _userRepository;

  UpdateProfileUseCase(this._userRepository);

  Future<Either<Failure, void>> call(UpdateProfileParams params) async {
    return await _userRepository.updateProfile(params.user);
  }
}