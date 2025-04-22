import 'package:firebase_core/firebase_core.dart' show FirebaseOptions;
import 'package:firebase_core/firebase_core.dart';
import 'dart:io' show Platform;
import 'package:flutter_dotenv/flutter_dotenv.dart';

class FirebaseCustomOptions {
  static FirebaseOptions get currentPlatform {
    return web;
  }

  static FirebaseOptions get web => const FirebaseOptions(
    apiKey: String.fromEnvironment('webApiKey'),
    appId: String.fromEnvironment('webAppId'),
    messagingSenderId: String.fromEnvironment('webMessagingSenderId'),
    projectId: String.fromEnvironment('webProjectId'),
    authDomain: String.fromEnvironment('webAuthDomain'),
    databaseURL: String.fromEnvironment('webDatabaseURL'),
    storageBucket: String.fromEnvironment('webStorageBucket'),
    measurementId: String.fromEnvironment('webMeasurementId'),
  );
}