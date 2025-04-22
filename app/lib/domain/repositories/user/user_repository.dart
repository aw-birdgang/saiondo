import 'dart:async';

import 'package:app/domain/core/failures.dart';
import 'package:app/domain/entities/user/user.dart';
import 'package:app/domain/usecases/user/login_usecase.dart';
import 'package:dartz/dartz.dart';

abstract class UserRepository {
  Future<bool> isLoggedIn();
  Future<void> saveLoginStatus(bool status);
  Future<User?> login(LoginParams params);
  Future<User?> signup(String email, String password, String name);
  Future<void> logout();
  Future<void> resetPassword(String email);
  Future<Either<Failure, User>> getCurrentUser();
  Future<Either<Failure, void>> updateProfile(User user);
}