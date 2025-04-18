import 'dart:async';

import 'package:app/domain/entry/user/user.dart';
import 'package:app/domain/usecase/user/login_usecase.dart';

abstract class UserRepository {
  Future<User?> login(LoginParams params);
  Future<void> saveIsLoggedIn(bool value);
  Future<bool> get isLoggedIn;
}