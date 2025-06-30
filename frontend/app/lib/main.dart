import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:saiondo/presentation/my_app.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'di/service_locator.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  // 1. 앱이 푸시 클릭으로 실행된 경우 메시지 확인
  final initialMessage = await FirebaseMessaging.instance.getInitialMessage();

  await setPreferredOrientations();
  await ServiceLocator.configureDependencies();
  runApp(MyApp(initialMessage: initialMessage));
}

Future<void> setPreferredOrientations() {
  return SystemChrome.setPreferredOrientations([
    DeviceOrientation.portraitUp,
    DeviceOrientation.portraitDown,
    DeviceOrientation.landscapeRight,
    DeviceOrientation.landscapeLeft,
  ]);
}

Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {
  await Firebase.initializeApp();
  print('Handling a background message: ${message.messageId}');
}
