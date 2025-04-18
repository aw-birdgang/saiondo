import 'package:app/presentation/login/login.dart';
import 'package:flutter/material.dart';

import '../../screens/auth_screen.dart';
import '../../screens/calendar_screen.dart';
import '../../screens/challenge_screen.dart';
import '../../screens/compliment_screen.dart';
import '../../screens/connect_screen.dart';
import '../../screens/couple_screen.dart';
import '../../screens/emotion_history_screen.dart';
import '../../screens/emotion_screen.dart';
import '../../screens/feedback_screen.dart';
import '../../screens/home_with_tabs.dart';
import '../../screens/onboarding_screen.dart';
import '../../screens/settings_screen.dart';

class Routes {
  Routes._();

  static const String login = '/login';
  static const String home = '/faq';
  static const String auth = '/auth';
  static const String onboarding = '/onboarding';
  static const String connect = '/connect';
  static const String emotion = '/emotion';
  static const String emotion_history = '/emotion-history';
  static const String feedback = '/feedback';
  static const String challenge = '/challenge';
  static const String compliment = '/compliment';
  static const String calendar = '/calendar';
  static const String couple = '/couple';
  static const String settings = '/settings';

  static final routes = <String, WidgetBuilder>{
    login: (BuildContext context) => LoginScreen(),
    home: (BuildContext context) => HomeWithTabs(),
    auth: (BuildContext context) => AuthScreen(),
    onboarding: (BuildContext context) => OnboardingScreen(),
    connect: (BuildContext context) => ConnectScreen(),
    emotion: (BuildContext context) => EmotionScreen(),
    emotion_history: (BuildContext context) => EmotionHistoryScreen(),
    feedback: (BuildContext context) => FeedbackScreen(),
    challenge: (BuildContext context) => ChallengeScreen(),
    compliment: (BuildContext context) => ComplimentScreen(),
    calendar: (BuildContext context) => CalendarScreen(),
    couple: (BuildContext context) => CoupleScreen(),
    settings: (BuildContext context) => SettingsScreen(),
  };

}