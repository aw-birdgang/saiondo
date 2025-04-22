import 'package:flutter/material.dart';

import '../../presentation/home/home.dart';
import '../../presentation/login/login.dart';
import '../../presentation/profile/profile.dart';
import '../../presentation/signup/signup.dart';
import '../../presentation/emotion/emotion.dart';

class Routes {
  Routes._();

  static const String login = '/login';
  static const String signup = '/signup';
  static const String home = '/home';
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
  static const String profile = '/profile';

  static final routes = <String, WidgetBuilder>{
    login: (BuildContext context) => const LoginScreen(),
    signup: (BuildContext context) => const SignUpScreen(),
    home: (BuildContext context) => const HomeScreen(),
    profile: (BuildContext context) => const ProfileScreen(),
    // auth: (BuildContext context) => AuthScreen(),
    // onboarding: (BuildContext context) => OnboardingScreen(),
    // connect: (BuildContext context) => ConnectScreen(),
    emotion: (BuildContext context) => const EmotionScreen(),
    // emotion_history: (BuildContext context) => EmotionHistoryScreen(),
    // feedback: (BuildContext context) => FeedbackScreen(),
    // challenge: (BuildContext context) => ChallengeScreen(),
    // compliment: (BuildContext context) => ComplimentScreen(),
    // calendar: (BuildContext context) => CalendarScreen(),
    // couple: (BuildContext context) => CoupleScreen(),
    // settings: (BuildContext context) => SettingsScreen(),
  };
}