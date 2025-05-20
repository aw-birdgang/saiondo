import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:app/presentation/my_app.dart';
import 'package:firebase_core/firebase_core.dart';
import 'package:firebase_messaging/firebase_messaging.dart';

import 'di/service_locator.dart';


Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await Firebase.initializeApp();
  FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

  await setPreferredOrientations();
  await ServiceLocator.configureDependencies();
  runApp(MyApp());
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
