import 'dart:async';

import 'package:app/data/repository/setting/setting_repository_impl.dart';
import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/domain/repository/setting/setting_repository.dart';

import '../../../domain/repository/chat/chat_repository.dart';
import '../../network/apis/chats/chst_api.dart';
import '../../repository/chat/chat_repository_impl.dart';

class RepositoryModule {
  static Future<void> configureRepositoryModuleInjection() async {
    // repository:--------------------------------------------------------------
    getIt.registerSingleton<SettingRepository>(SettingRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));
    getIt.registerSingleton<ChatRepository>(ChatRepositoryImpl(
      getIt<ChatApi>(),
    ));
  }
}