import 'dart:async';

import 'package:app/data/repository/setting/setting_repository_impl.dart';
import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/domain/repository/setting/setting_repository.dart';

import '../../../domain/repository/chat_history/chat_history_repository.dart';
import '../../network/apis/chat_history_api.dart';
import '../../repository/chat_history_repository_impl.dart';

class RepositoryModule {
  static Future<void> configureRepositoryModuleInjection() async {
    // repository:--------------------------------------------------------------
    getIt.registerSingleton<SettingRepository>(SettingRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));

    final chatHistoryRepoImpl = ChatHistoryRepositoryImpl(getIt<ChatHistoryApi>());
    // 인터페이스와 구현체 모두 등록
    getIt.registerSingleton<ChatHistoryRepository>(chatHistoryRepoImpl);
    getIt.registerSingleton<ChatHistoryRepositoryImpl>(chatHistoryRepoImpl);

  }
}