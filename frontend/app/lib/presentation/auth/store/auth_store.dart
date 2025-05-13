import 'package:app/domain/repository/user/user_repository.dart';
import 'package:logger/logger.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/entry/user/user.dart';
import '../../../domain/repository/auth/auth_repository.dart';
import '../../../domain/usecase/auth/login_usecase.dart';
import '../../../domain/usecase/auth/register_usecase.dart';

part 'auth_store.g.dart';

class AuthStore = _AuthStore with _$AuthStore;

abstract class _AuthStore with Store {
  final LoginUseCase _loginUseCase;
  final RegisterUseCase _registerUseCase;
  final AuthRepository _authRepository;
  final UserRepository _userRepository;

  _AuthStore(this._loginUseCase, this._registerUseCase, this._authRepository, this._userRepository);

  final logger = Logger();

  @observable
  String? accessToken;

  @observable
  String? userId;

  @observable
  Map<String, dynamic>? user;

  @observable
  List<dynamic> userRooms = [];

  @observable
  String? roomId;

  @observable
  String? error;

  @observable
  bool isLoggedIn = false;

  @action
  Future<bool> login(String email, String password) async {
    try {
      final result = await _loginUseCase(email, password);
      logger.i('로그인 응답: $result');
      accessToken = result['accessToken'];
      user = result['user'];
      userId = user?['id'];
      error = null;
      
      if (userId != null) {
        userRooms = await _userRepository.fetchUserRooms(userId!);
        if (userRooms.isNotEmpty) {
          roomId = userRooms.first['id'];
        }
        await _userRepository.saveUser(User.fromJson(user!));
        isLoggedIn = true;
        return true;
      }
    } catch (e) {
      error = e.toString();
      logger.e('로그인 에러: $e');
    }
    return false;
  }

  @action
  Future<void> register(String email, String password, String name, String gender) async {
    try {
      final result = await _registerUseCase(email, password, name, gender);
      user = result['user'];
      accessToken = result['accessToken'];
      userId = user?['id'];
      error = null;
      // 저장은 AuthRepository에서 이미 처리됨
    } catch (e) {
      error = e.toString();
    }
  }

  @action
  Future<void> loadAuthFromPrefs() async {
    try {
      accessToken = await _authRepository.getAccessToken();
      userId = await _authRepository.getUserId();
      logger.i('저장된 accessToken: $accessToken, userId: $userId');
    } catch (e, stack) {
      logger.e('loadAuthFromPrefs 에러: $e\n$stack');
      error = e.toString();
    }
  }

  @action
  Future<void> logout() async {
    await _authRepository.logout();
    accessToken = null;
    userId = null;
    user = null;
    error = null;
    isLoggedIn = false;
  }
}