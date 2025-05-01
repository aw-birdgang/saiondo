import 'dart:async';

import 'package:app/core/stores/form/form_store.dart';
import 'package:app/domain/usecase/chat/send_message_usecase.dart';
import 'package:app/domain/usecase/home/get_menu_items_usecase.dart';
import 'package:app/domain/usecase/home/navigate_to_screen_usecase.dart';
import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';
import 'package:app/presentation/home/store/home/home_store.dart';
import 'package:app/presentation/home/store/theme/theme_store.dart';
import 'package:app/presentation/navigation/store/navigation_store.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../di/service_locator.dart';
import '../../../domain/repository/setting/setting_repository.dart';
import '../../chat/store/chat_store.dart';
import '../../home/store/language_store/language_store.dart';

class StoreModule {
  static Future<void> configureStoreModuleInjection() async {
    // factories:---------------------------------------------------------------
    getIt.registerFactory(() => ErrorStore());
    getIt.registerFactory(() => FormErrorStore());
    getIt.registerFactory(
          () => FormStore(getIt<FormErrorStore>(), getIt<ErrorStore>()),
    );

    // stores:------------------------------------------------------------------
    getIt.registerSingleton<NavigationStore>(
      NavigationStore(
        getIt<NavigationScreenUseCase>()
      ),
    );

    getIt.registerSingleton<HomeStore>(
      HomeStore(
        getIt<ErrorStore>(),
      ),
    );

    getIt.registerSingleton<ChatStore>(
      ChatStore(
        getIt<SendMessageUseCase>(),
        getIt<ErrorStore>(),
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
