import 'package:flutter/material.dart';

import '../../presentation/auth/login_screen.dart';
import '../../presentation/auth/register_screen.dart';
import '../../presentation/category/category_code_guide.dart';
import '../../presentation/chat/chat.dart';
import '../../presentation/home/home.dart';

class Routes {
  Routes._();

  static const String login = '/login';
  static const String register = '/register';
  static const String home = '/home';
  static const String chat = '/chat';
  static const String categoryGuide = '/category_guide';

  static final routes = <String, WidgetBuilder>{
    home: (BuildContext context) => HomeScreen(),
    chat: (BuildContext context) {
      final args = ModalRoute.of(context)!.settings.arguments as Map<String, dynamic>;
      return ChatScreen(
        userId: args['userId'] as String,
        assistantId: args['assistantId'] as String,
        channelId: args['channelId'] as String,
      );
    },
    login: (BuildContext context) => LoginScreen(),
    register: (BuildContext context) => RegisterScreen(),
    categoryGuide: (BuildContext context)=> CategoryCodeGuideScreen(),
  };

}