import 'package:app/constants/app_theme.dart';
import 'package:app/presentation/home/home.dart';
import 'package:app/presentation/login/login.dart';
import 'package:app/presentation/login/store/login_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../constants/strings.dart';
import '../di/service_locator.dart';
import '../utils/locale/app_localization.dart';
import '../utils/routes/routes.dart';
import 'home/store/language_store/language_store.dart';
import 'home/store/theme/theme_store.dart';

class MyApp extends StatelessWidget {
  final ThemeStore _themeStore = getIt<ThemeStore>();
  final LanguageStore _languageStore = getIt<LanguageStore>();
  final UserStore _userStore = getIt<UserStore>();

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (context) {
        return MaterialApp(
          debugShowCheckedModeBanner: false,
          title: Strings.appName,
          theme: _themeStore.darkMode
              ? AppThemeData.darkThemeData
              : AppThemeData.lightThemeData,
          routes: Routes.routes,
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
          home: _userStore.isLoggedIn ? const HomeScreen() : const LoginScreen(),
        );
      }
    );
  }
}