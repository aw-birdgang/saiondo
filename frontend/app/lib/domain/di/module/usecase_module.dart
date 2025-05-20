import 'dart:async';

import 'package:app/di/service_locator.dart';
import 'package:app/domain/usecase/home/get_menu_items_usecase.dart';
import 'package:app/domain/usecase/navigation/navigation_screen_usecase.dart';
import 'package:app/domain/usecase/user/update_fcm_token_usecase.dart';

import '../../../data/network/apis/category_code_api.dart';
import '../../../data/network/apis/user_api.dart';
import '../../../data/repository/chat_history_repository_impl.dart';
import '../../repository/assistant/assitant_repository.dart';
import '../../repository/auth/auth_repository.dart';
import '../../usecase/assistant/fetch_assistants_usecase.dart';
import '../../usecase/auth/login_usecase.dart';
import '../../usecase/auth/register_usecase.dart';
import '../../usecase/category/fetch_category_codes_usecase.dart';
import '../../usecase/chat/fetch_chat_histories_usecase.dart';
import '../../usecase/chat/send_message_usecase.dart';

class UseCaseModule {
  static Future<void> configureUseCaseModuleInjection() async {

    // navigation:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => NavigationScreenUseCase());
    
    // home:--------------------------------------------------------------------
    getIt.registerLazySingleton(() => GetMenuItemsUseCase());

    // chat:--------------------------------------------------------------------
    getIt.registerLazySingleton<FetchChatHistoriesUseCase>(
            () => FetchChatHistoriesUseCase(getIt<ChatHistoryRepositoryImpl>()));

    getIt.registerLazySingleton<SendMessageUseCase>(
            () => SendMessageUseCase(getIt<ChatHistoryRepositoryImpl>()));

    // auth:--------------------------------------------------------------------
    getIt.registerLazySingleton<LoginUseCase>(
            () => LoginUseCase(getIt<AuthRepository>()));
    getIt.registerLazySingleton<RegisterUseCase>(
            () => RegisterUseCase(getIt<AuthRepository>()));

    // auth:--------------------------------------------------------------------
    getIt.registerLazySingleton<UpdateFcmTokenUseCase>(
            () => UpdateFcmTokenUseCase(getIt<UserApi>()));

    // category code:--------------------------------------------------------------------
    getIt.registerLazySingleton<FetchCategoryCodesUseCase>(
            () => FetchCategoryCodesUseCase(getIt<CategoryCodeApi>()));

    // assistant:--------------------------------------------------------------------
    getIt.registerLazySingleton<FetchAssistantsUseCase>(
            () => FetchAssistantsUseCase(getIt<AssistantRepository>()));



  }
}
