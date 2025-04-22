import 'dart:async';

import 'package:app/di/service_locator.dart';

import '../../repositories/daily_tip/daily_tip_repository.dart';
import '../../repositories/user/user_repository.dart';
import '../../repositories/emotion/emotion_log_repository.dart';
import '../../usecases/daily_tip/get_daily_tip_usecase.dart';
import '../../usecases/emotion/get_emotion_logs_usecase.dart';
import '../../usecases/emotion/get_recent_emotion_logs_usecase.dart';
import '../../usecases/emotion/save_emotion_log_usecase.dart';
import '../../usecases/user/get_current_user_usecase.dart';
import '../../usecases/user/is_logged_in_usecase.dart';
import '../../usecases/user/login_usecase.dart';
import '../../usecases/user/reset_password_usecase.dart';
import '../../usecases/user/save_login_in_status_usecase.dart';
import '../../usecases/user/signup_usecase.dart';
import '../../usecases/user/update_profile_usecase.dart';


class UseCaseModule {
  static Future<void> configureUseCaseModuleInjection() async {

    // user:--------------------------------------------------------------------
    getIt.registerSingleton<IsLoggedInUseCase>(
      IsLoggedInUseCase(getIt<UserRepository>()),
    );
    getIt.registerSingleton<SaveLoginStatusUseCase>(
      SaveLoginStatusUseCase(getIt<UserRepository>()),
    );
    getIt.registerSingleton<LoginUseCase>(
      LoginUseCase(getIt<UserRepository>()),
    );
    getIt.registerSingleton<SignUpUseCase>(
      SignUpUseCase(getIt<UserRepository>()),
    );

    if (!getIt.isRegistered<GetCurrentUserUseCase>()) {
      getIt.registerSingleton<GetCurrentUserUseCase>(
        GetCurrentUserUseCase(getIt<UserRepository>()),
      );
    }

    getIt.registerSingleton<ResetPasswordUseCase>(
      ResetPasswordUseCase(getIt<UserRepository>()),
    );

    if (!getIt.isRegistered<UpdateProfileUseCase>()) {
      getIt.registerSingleton<UpdateProfileUseCase>(
        UpdateProfileUseCase(getIt<UserRepository>()),
      );
    }

    // emotion:--------------------------------------------------------------------
    if (!getIt.isRegistered<GetEmotionLogsUseCase>()) {
      getIt.registerLazySingleton<GetEmotionLogsUseCase>(
            () => GetEmotionLogsUseCase(getIt<EmotionLogRepository>()),
      );
    }
    if (!getIt.isRegistered<GetRecentEmotionLogsUseCase>()) {
      getIt.registerLazySingleton<GetRecentEmotionLogsUseCase>(
            () => GetRecentEmotionLogsUseCase(getIt<EmotionLogRepository>()),
      );
    }
    if (!getIt.isRegistered<SaveEmotionLogUseCase>()) {
      getIt.registerLazySingleton<SaveEmotionLogUseCase>(
            () => SaveEmotionLogUseCase(getIt<EmotionLogRepository>()),
      );
    }

    // daily tip:--------------------------------------------------------------------
    if (!getIt.isRegistered<GetDailyTipUseCase>()) {
      getIt.registerLazySingleton<GetDailyTipUseCase>(
            () => GetDailyTipUseCase(getIt<DailyTipRepository>()),
      );
    }

  }
}
