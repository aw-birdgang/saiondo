import 'dart:async';

import 'package:app/data/repository/setting/setting_repository_impl.dart';
import 'package:app/data/repository/user/user_repository_impl.dart';
import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/domain/repository/setting/setting_repository.dart';
import 'package:app/domain/repository/user/user_repository.dart';


class RepositoryModule {
  static Future<void> configureRepositoryModuleInjection() async {
    // repository:--------------------------------------------------------------
    getIt.registerSingleton<SettingRepository>(SettingRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));

    getIt.registerSingleton<UserRepository>(UserRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));

  }
}