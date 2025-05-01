import 'dart:async';

import 'package:app/di/service_locator.dart';
import 'package:app/domain/usecase/home/get_menu_items_usecase.dart';
import 'package:app/domain/usecase/home/navigate_to_screen_usecase.dart';
import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';

import '../../repository/chat/chat_repository.dart';
import '../../usecase/chat/send_message_usecase.dart';

class UseCaseModule {
  static Future<void> configureUseCaseModuleInjection() async {

    // navigation:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => NavigationScreenUseCase());
    
    // home:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => NavigateToScreenUseCase());
    getIt.registerLazySingleton(() => GetMenuItemsUseCase());

    // chat:--------------------------------------------------------------------
    getIt.registerSingleton<SendMessageUseCase>(
      SendMessageUseCase(getIt<ChatRepository>()),
    );

  }
}
