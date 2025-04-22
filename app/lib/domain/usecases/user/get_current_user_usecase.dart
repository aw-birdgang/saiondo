import 'package:app/domain/core/failures.dart';
import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/repositories/user/user_repository.dart';
import 'package:dartz/dartz.dart';

class GetCurrentUserUseCase {
  final UserRepository _userRepository;
  GetCurrentUserUseCase(this._userRepository);
  Future<Either<Failure, User>> call() async {
    return _userRepository.getCurrentUser();
  }
}