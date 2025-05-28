import 'package:app/constants/app_theme.dart';
import 'package:app/presentation/home/store/theme_store.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../constants/strings.dart';
import '../di/service_locator.dart';
import '../utils/locale/app_localization.dart';
import '../utils/routes/routes.dart';
import 'auth/store/auth_store.dart';
import 'home/store/language_store.dart';

final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

class MyApp extends StatefulWidget {
  final RemoteMessage? initialMessage;
  MyApp({this.initialMessage});

  @override
  State<MyApp> createState() => _MyAppState();
}

class _MyAppState extends State<MyApp> {
  final ThemeStore _themeStore = getIt<ThemeStore>();
  final LanguageStore _languageStore = getIt<LanguageStore>();
  final AuthStore _authStore = getIt<AuthStore>();

  @override
  void initState() {
    super.initState();
    _authStore.loadAuthFromPrefs();
    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      _handlePushNavigation(message);
    });

    // 앱 완전 종료 후 푸시 클릭으로 진입한 경우
    if (widget.initialMessage != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        _handlePushNavigation(widget.initialMessage!);
      });
    }
  }

  void _handlePushNavigation(RemoteMessage message) {
    final data = message.data;
    final userId = data['userId'];
    final channelId = data['channelId'];
    final assistantId = data['assistantId'];
    
    // Null check
    if (userId == null || channelId == null || assistantId == null) {
      print('[_handlePushNavigation] Error: Missing required parameters');
      print('userId: $userId, channelId: $channelId, assistantId: $assistantId');
      return;
    }

    print('[_handlePushNavigation] Attempting navigation with:');
    print('userId: $userId, channelId: $channelId, assistantId: $assistantId');

    // Routes.chat 상수를 사용
    navigatorKey.currentState?.pushNamed(
      Routes.chat,  // '/chat' 대신 Routes.chat 사용
      arguments: {
        'userId': userId,
        'channelId': channelId,
        'assistantId': assistantId,
      },
    ).then((_) {
      print('[_handlePushNavigation] Navigation completed');
    }).catchError((error) {
      print('[_handlePushNavigation] Navigation error: $error');
    });
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        final token = _authStore.accessToken;
        return MaterialApp(
          navigatorKey: navigatorKey,
          debugShowCheckedModeBanner: false,
          title: Strings.appName,
          theme: _themeStore.darkMode
              ? AppThemeData.darkThemeData
              : AppThemeData.lightThemeData,
          routes: Routes.routes,
          initialRoute: Routes.splash,
          locale: Locale(_languageStore.locale),
          supportedLocales: _languageStore.supportedLanguages
              .map((language) => Locale(language.locale, language.code))
              .toList(),
          localizationsDelegates: const [
            AppLocalizations.delegate,
            GlobalMaterialLocalizations.delegate,
            GlobalWidgetsLocalizations.delegate,
            GlobalCupertinoLocalizations.delegate,
          ],
          onGenerateRoute: (settings) {
            print('[MyApp] Generating route: ${settings.name}');
            print('[MyApp] Route arguments: ${settings.arguments}');
            return null;
          },
        );
      },
    );
  }
}