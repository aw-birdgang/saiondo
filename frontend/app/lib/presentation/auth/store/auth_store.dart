import 'package:app/domain/repository/user/user_repository.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:logger/logger.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/repository/auth/auth_repository.dart';
import '../../../domain/usecase/auth/login_usecase.dart';
import '../../../domain/usecase/auth/register_usecase.dart';
import '../../../domain/usecase/user/update_fcm_token_usecase.dart';

part 'auth_store.g.dart';

class AuthStore = _AuthStore with _$AuthStore;

abstract class _AuthStore with Store {
  final LoginUseCase _loginUseCase;
  final RegisterUseCase _registerUseCase;
  final AuthRepository _authRepository;
  final UserRepository _userRepository;
  final UpdateFcmTokenUseCase updateFcmTokenUseCase;

  _AuthStore(
      this._loginUseCase,
      this._registerUseCase,
      this._authRepository,
      this._userRepository,
      this.updateFcmTokenUseCase,
  ) {
    _setupDisposers();
  }

  final logger = Logger();

  // disposers:-----------------------------------------------------------------
  late List<ReactionDisposer> _disposers;

  void _setupDisposers() {
    _disposers = [
      reaction((_) => isLoggedIn, (bool loggedIn) {
        if (loggedIn) {
          registerFcmToken();
        }
      }),
      reaction((_) => success, (_) => success = false, delay: 200),
    ];
  }

  @observable
  bool success = false;

  @observable
  String? accessToken;

  @observable
  String? userId;

  @observable
  String? fcmToken;

  @observable
  bool fcmRegistered = false;

  @observable
  Map<String, dynamic>? user;

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
      isLoggedIn = true;
      return true;
    } catch (e) {
      error = e.toString();
      logger.e('로그인 에러: $e');
      isLoggedIn = false;
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
      isLoggedIn = true;
    } catch (e) {
      error = e.toString();
      isLoggedIn = false;
    }
  }

  @action
  Future<void> loadAuthFromPrefs() async {
    try {
      accessToken = await _authRepository.getAccessToken();
      userId = await _authRepository.getUserId();
      logger.i('저장된 accessToken: $accessToken, userId: $userId');
      isLoggedIn = accessToken != null && userId != null;
    } catch (e, stack) {
      logger.e('loadAuthFromPrefs 에러: $e\n$stack');
      error = e.toString();
      isLoggedIn = false;
    }
  }

  @action
  Future<void> registerFcmToken() async {
    try {
      final messaging = FirebaseMessaging.instance;
      await messaging.requestPermission();
      final token = await messaging.getToken();
      logger.i('FCM Token: $token');
      fcmToken = token;
      if (token != null && userId != null) {
        await updateFcmTokenUseCase(userId!, token);
        logger.i('FCM 토큰 서버 저장 완료: $token');
        fcmRegistered = true;
      } else {
        fcmRegistered = false;
      }
      // 포그라운드 메시지 수신
      FirebaseMessaging.onMessage.listen((RemoteMessage message) {
        logger.i('Received a message in foreground: ${message.notification?.title}');
        // TODO: 알림 UI 처리
      });
      // 앱이 백그라운드/종료 상태에서 푸시 클릭 시
      FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
        logger.i('Message clicked!');
        // TODO: 라우팅 등 처리
      });
    } catch (e) {
      logger.e('FCM 등록 실패: $e');
      fcmRegistered = false;
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
    fcmToken = null;
    fcmRegistered = false;
  }
}