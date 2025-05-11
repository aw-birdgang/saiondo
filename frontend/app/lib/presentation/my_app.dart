import 'package:app/constants/app_theme.dart';
import 'package:app/presentation/home/store/theme/theme_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../constants/strings.dart';
import '../di/service_locator.dart';
import '../utils/locale/app_localization.dart';
import '../utils/routes/routes.dart';
import 'auth/login_screen.dart';
import 'auth/store/auth_store.dart';
import 'home/home.dart';
import 'home/store/language_store/language_store.dart';

class MyApp extends StatelessWidget {
  final ThemeStore _themeStore = getIt<ThemeStore>();
  final LanguageStore _languageStore = getIt<LanguageStore>();
  final AuthStore _authStore = getIt<AuthStore>();

  MyApp();

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        final token = _authStore.accessToken;
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: Strings.appName,
          theme: _themeStore.darkMode
              ? AppThemeData.darkThemeData
              : AppThemeData.lightThemeData,
          routes: {
            ...Routes.routes,
          },
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
          home: token == null ? LoginScreen() : HomeScreen(),
        );
      },
    );
  }
}