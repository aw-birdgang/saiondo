import 'package:flutter/material.dart';

import '../../presentation/analysis/analysis_screen.dart';
import '../../presentation/auth/login_screen.dart';
import '../../presentation/auth/register_screen.dart';
import '../../presentation/category/category_code_guide.dart';
import '../../presentation/chat/chat.dart';
import '../../presentation/home/home.dart';
import '../../presentation/notifications/notifications.dart';
import '../../presentation/splash/splash_screen.dart';

class Routes {
  Routes._();

  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String chat = '/chat';
  static const String categoryGuide = '/category_guide';
  static const String notification = '/notification';
  static const String analysis = '/analysis';
  static const String splash = '/splash';

  static final routes = <String, WidgetBuilder>{
    home: (BuildContext context) => HomeScreen(),
    chat: (BuildContext context) {
      print('[Routes] Attempting to build ChatScreen');
      final args = ModalRoute.of(context)?.settings.arguments as Map<String, dynamic>?;
      
      if (args == null) {
        print('[Routes] Error: No arguments provided');
        return const SizedBox.shrink(); // 또는 에러 화면
      }

      try {
        final userId = args['userId'] as String;
        final channelId = args['channelId'] as String;
        final assistantId = args['assistantId'] as String;
        
        print('[Routes] Building ChatScreen with:');
        print('userId: $userId, channelId: $channelId, assistantId: $assistantId');
        
        return ChatScreen(
          userId: userId,
          assistantId: assistantId,
          channelId: channelId,
        );
      } catch (e) {
        print('[Routes] Error building ChatScreen: $e');
        return const SizedBox.shrink(); // 또는 에러 화면
      }
    },
    login: (BuildContext context) => LoginScreen(),
    register: (BuildContext context) => RegisterScreen(),
    categoryGuide: (BuildContext context)=> CategoryCodeGuideScreen(),
    notification: (BuildContext context)=> NotificationsScreen(),
    analysis: (context) {
      final args = ModalRoute.of(context)!.settings.arguments as Map;
      return AnalysisScreen(
        channelId: args['channelId'],
      );
    },
    splash: (BuildContext context) => const SplashScreen(),
  };

}