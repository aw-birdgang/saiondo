import 'dart:async';

import 'package:app/di/service_locator.dart';
import 'package:app/domain/usecase/home/get_menu_items_usecase.dart';
import 'package:app/domain/usecase/home/navigate_to_screen_usecase.dart';
import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';

import '../../../data/repository/chat_history_repository_impl.dart';
import '../../usecase/chat/fetch_chat_histories_usecase.dart';
import '../../usecase/chat/send_message_usecase.dart';

class UseCaseModule {
  static Future<void> configureUseCaseModuleInjection() async {

    // navigation:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => NavigationScreenUseCase());
    
    // home:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => NavigateToScreenUseCase());
    getIt.registerLazySingleton(() => GetMenuItemsUseCase());

    // chat:--------------------------------------------------------------------
    getIt.registerLazySingleton<FetchChatHistoriesUseCase>(
            () => FetchChatHistoriesUseCase(getIt<ChatHistoryRepositoryImpl>()));

    getIt.registerLazySingleton<SendMessageUseCase>(
            () => SendMessageUseCase(getIt<ChatHistoryRepositoryImpl>()));

  }
}
