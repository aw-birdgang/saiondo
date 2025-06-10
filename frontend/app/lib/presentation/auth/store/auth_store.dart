import 'package:app/domain/repository/user_repository.dart';
import 'package:dio/dio.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:logger/logger.dart';
import 'package:mobx/mobx.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../domain/entry/user.dart';
import '../../../domain/repository/auth_repository.dart';
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
    _initFcm();
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

  @observable
  int unreadPushCount = 0;

  @observable
  ObservableList<String> pushMessages = ObservableList<String>();

  @observable
  String? lastPushMessage;

  BuildContext? _rootContext;

  void setRootContext(BuildContext context) {
    _rootContext = context;
  }

  @observable
  User? currentUser;

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
      currentUser = User.fromJson(user!);
      final prefs = await SharedPreferences.getInstance();
      await prefs.setString('userId', userId!);
      return true;
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        await clearUserCache();
        currentUser = null;
      }
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
      logger.i('회원 가입 응답: $result');
      user = result['user'];
      accessToken = result['accessToken'];
      userId = user?['id'];
      error = null;
      isLoggedIn = true;
    } on DioException catch (e) {
      if (e.response?.statusCode == 404) {
        await clearUserCache();
        currentUser = null;
      }
      error = e.toString();
      logger.e('회원 가입 에러: $e');
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

  @action
  void incrementUnreadPush([String? message]) {
    unreadPushCount++;
    if (message != null) {
      pushMessages.insert(0, message);
    }
  }

  @action
  void clearUnreadPush() {
    unreadPushCount = 0;
  }

  @action
  void clearAllPushMessages() {
    pushMessages.clear();
    unreadPushCount = 0;
  }

  void _initFcm() {
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      final title = message.notification?.title ?? '';
      final body = message.notification?.body ?? '';
      incrementUnreadPush('$title\n$body');
    });

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handlePushNavigation(message);
    });
  }

  void _handlePushNavigation(RemoteMessage message) {
    final data = message.data;
    final channelId = data['channelId'];
    final assistantId = data['assistantId'];
    if (channelId != null && _rootContext != null) {
      Navigator.of(_rootContext!).pushNamed(
        '/chat',
        arguments: {
          'channelId': channelId,
          'assistantId': assistantId,
        },
      );
    }
  }

  @action
  Future<void> clearUserCache() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove('userId');
    accessToken = null;
    userId = null;
    user = null;
    error = null;
    isLoggedIn = false;
    fcmToken = null;
    fcmRegistered = false;
  }
}