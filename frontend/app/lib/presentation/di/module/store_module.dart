import 'dart:async';

import 'package:app/core/stores/form/form_store.dart';
import 'package:app/domain/repository/user/user_repository.dart';
import 'package:app/domain/usecase/assistant/fetch_assistants_usecase.dart';
import 'package:app/domain/usecase/auth/login_usecase.dart';
import 'package:app/domain/usecase/auth/register_usecase.dart';
import 'package:app/domain/usecase/category/fetch_category_codes_usecase.dart';
import 'package:app/domain/usecase/chat/send_message_usecase.dart';
import 'package:app/presentation/analysis/store/analysis_store.dart';
import 'package:app/presentation/home/store/home/home_store.dart';
import 'package:app/presentation/home/store/theme/theme_store.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../data/network/socket_io/socket_io_service.dart';
import '../../../di/service_locator.dart';
import '../../../domain/repository/advice_repository.dart';
import '../../../domain/repository/analysis_repository.dart';
import '../../../domain/repository/auth/auth_repository.dart';
import '../../../domain/repository/channel_repository.dart';
import '../../../domain/repository/setting/setting_repository.dart';
import '../../../domain/usecase/chat/fetch_chat_histories_usecase.dart';
import '../../../domain/usecase/user/update_fcm_token_usecase.dart';
import '../../advice/store/advice_store.dart';
import '../../auth/store/auth_store.dart';
import '../../category/store/category_code_store.dart';
import '../../chat/store/chat_store.dart';
import '../../home/store/invite_code_store.dart';
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
        getIt<FetchAssistantsUseCase>(),
        getIt<ErrorStore>(),
      ),
    );
    getIt.registerSingleton<InviteCodeStore>(
      InviteCodeStore(
        getIt<ChannelRepository>(),
      ),
    );

    // :------------------------------------------------------------------
    getIt.registerSingleton<AuthStore>(
      AuthStore(
        getIt<LoginUseCase>(),
        getIt<RegisterUseCase>(),
        getIt<AuthRepository>(),
        getIt<UserRepository>(),
        getIt<UpdateFcmTokenUseCase>(),
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

    // :------------------------------------------------------------------
    getIt.registerSingleton<ChatStore>(
      ChatStore(
        getIt<FetchChatHistoriesUseCase>(),
        getIt<SendMessageUseCase>(),
        getIt<SocketIoService>(),
      ),
    );
    getIt.registerSingleton<AnalysisStore>(
      AnalysisStore(
        getIt<AnalysisRepository>(),
      ),
    );
    getIt.registerSingleton<AdviceStore>(
      AdviceStore(
        getIt<AdviceRepository>(),
      ),
    );

    // :------------------------------------------------------------------
    getIt.registerSingleton<CategoryCodeStore>(
      CategoryCodeStore(
        getIt<FetchCategoryCodesUseCase>(),
      ),
    );

    // stores::setting ------------------------------------------------------------------
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
