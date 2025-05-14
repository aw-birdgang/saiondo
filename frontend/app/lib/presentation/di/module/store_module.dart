import 'dart:async';

import 'package:app/core/stores/form/form_store.dart';
import 'package:app/domain/repository/user/user_repository.dart';
import 'package:app/domain/usecase/auth/login_usecase.dart';
import 'package:app/domain/usecase/auth/register_usecase.dart';
import 'package:app/domain/usecase/chat/send_message_usecase.dart';
import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';
import 'package:app/presentation/home/store/home/home_store.dart';
import 'package:app/presentation/home/store/theme/theme_store.dart';
import 'package:app/presentation/navigation/store/navigation_store.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../di/service_locator.dart';
import '../../../domain/repository/auth/auth_repository.dart';
import '../../../domain/repository/setting/setting_repository.dart';
import '../../../domain/usecase/chat/fetch_chat_histories_usecase.dart';
import '../../auth/store/auth_store.dart';
import '../../chat/store/chat_store.dart';
import '../../home/store/language_store/language_store.dart';
import '../../persona_profile/store/persona_profile_store.dart';
import '../../user/store/user_store.dart';

class StoreModule {
  static Future<void> configureStoreModuleInjection() async {
    // factories:---------------------------------------------------------------
    getIt.registerFactory(() => ErrorStore());
    getIt.registerFactory(() => FormErrorStore());
    getIt.registerFactory(
          () => FormStore(getIt<FormErrorStore>(), getIt<ErrorStore>()),
    );

    // stores:------------------------------------------------------------------
    getIt.registerSingleton<HomeStore>(
      HomeStore(
        getIt<ErrorStore>(),
      ),
    );

    getIt.registerSingleton<AuthStore>(
      AuthStore(
        getIt<LoginUseCase>(),
        getIt<RegisterUseCase>(),
        getIt<AuthRepository>(),
        getIt<UserRepository>(),
      ),
    );

    getIt.registerSingleton<UserStore>(
      UserStore(
        getIt<UserRepository>(),
      ),
    );

    getIt.registerSingleton<PersonaProfileStore>(
      PersonaProfileStore(
        getIt<UserRepository>(),
      ),
    );

    getIt.registerSingleton<ChatStore>(
      ChatStore(
        getIt<FetchChatHistoriesUseCase>(),
        getIt<SendMessageUseCase>(),
      ),
    );

    getIt.registerSingleton<ThemeStore>(
      ThemeStore(
        getIt<SettingRepository>(),
        getIt<ErrorStore>(),
      ),
    );

    getIt.registerSingleton<LanguageStore>(
      LanguageStore(
        getIt<SettingRepository>(),
        getIt<ErrorStore>(),
      ),
    );

  }
}
