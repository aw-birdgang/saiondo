import 'dart:async';

import 'package:app/data/repository/setting/setting_repository_impl.dart';
import 'package:app/data/sharedpref/shared_preference_helper.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/domain/repository/setting/setting_repository.dart';

import '../../../domain/repository/assistant/assitant_repository.dart';
import '../../../domain/repository/auth/auth_repository.dart';
import '../../../domain/repository/channel_repository.dart';
import '../../../domain/repository/chat_history/chat_history_repository.dart';
import '../../../domain/repository/user/user_repository.dart';
import '../../network/apis/assistant_api.dart';
import '../../network/apis/auth_api.dart';
import '../../network/apis/channel_api.dart';
import '../../network/apis/chat_history_api.dart';
import '../../network/apis/user_api.dart';
import '../../repository/assistant_repository_impl.dart';
import '../../repository/auth_repository_impl.dart';
import '../../repository/channel_repository_impl.dart';
import '../../repository/chat_history_repository_impl.dart';
import '../../repository/user_repository_impl.dart';

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

    // auth repository 등록
    getIt.registerSingleton<AuthRepository>(AuthRepositoryImpl(
      getIt<AuthApi>(),
      getIt<SharedPreferenceHelper>(),
    ));

    // user repository 등록
    getIt.registerSingleton<UserRepository>(UserRepositoryImpl(
      getIt<UserApi>(),
      getIt<SharedPreferenceHelper>()
    ));

    getIt.registerSingleton<ChannelRepository>(ChannelRepositoryImpl(
        getIt<ChannelApi>(),
    ));

    getIt.registerSingleton<AssistantRepository>(AssistantRepositoryImpl(
        getIt<AssistantApi>(),
    ));

  }
}