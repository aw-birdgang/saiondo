import 'dart:async';

import 'package:app/data/repositories/emotion/emotion_log_repository_impl.dart';
import 'package:app/data/repositories/setting/setting_repository_impl.dart';
import 'package:app/data/repositories/user/user_repository_impl.dart';
import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/domain/repositories/emotion/emotion_log_repository.dart';
import 'package:app/domain/repositories/setting/setting_repository.dart';
import 'package:app/domain/repositories/user/user_repository.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:firebase_storage/firebase_storage.dart';

import '../../../di/service_locator.dart';
import '../../../domain/repositories/daily_tip/daily_tip_repository.dart';
import '../../repositories/daily_tip/daily_tip_repository_impl.dart';

class RepositoryModule {
  static Future<void> configureRepositoryModuleInjection() async {
    // repository:--------------------------------------------------------------
    getIt.registerSingleton<SettingRepository>(SettingRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));

    if (!getIt.isRegistered<UserRepository>()) {
      getIt.registerLazySingleton<UserRepository>(
            () => UserRepositoryImpl(
              getIt<FirebaseFirestore>(),
              getIt<FirebaseAuth>(),
              getIt<FirebaseStorage>(),
              getIt<SharedPreferenceHelper>(),
        ),
      );
    }

    if (!getIt.isRegistered<EmotionLogRepository>()) {
      getIt.registerLazySingleton<EmotionLogRepository>(
            () => EmotionLogRepositoryImpl(getIt<FirebaseFirestore>(),),
      );
    }

    if (!getIt.isRegistered<DailyTipRepository>()) {
      getIt.registerLazySingleton<DailyTipRepository>(
            () => DailyTipRepositoryImpl(getIt<FirebaseFirestore>(),),
      );
    }

  }
}