import 'dart:async';

import 'package:app/core/stores/form/form_store.dart';
import 'package:app/domain/usecases/daily_tip/get_daily_tip_usecase.dart';
import 'package:app/domain/usecases/emotion/get_emotion_logs_usecase.dart';
import 'package:app/domain/usecases/emotion/get_recent_emotion_logs_usecase.dart';
import 'package:app/domain/usecases/emotion/save_emotion_log_usecase.dart';
import 'package:app/domain/usecases/user/get_current_user_usecase.dart';
import 'package:app/domain/usecases/user/is_logged_in_usecase.dart';
import 'package:app/domain/usecases/user/login_usecase.dart';
import 'package:app/domain/usecases/user/save_login_in_status_usecase.dart';
import 'package:app/domain/usecases/user/signup_usecase.dart';
import 'package:app/domain/usecases/user/update_profile_usecase.dart';
import 'package:app/presentation/calendar_tab/store/calendar_tab_store.dart';
import 'package:app/presentation/emotion/emotion.dart';
import 'package:app/presentation/emotion/store/emotion_store.dart';
import 'package:app/presentation/home/store/home/home_store.dart';
import 'package:app/presentation/home/store/language_store/language_store.dart';
import 'package:app/presentation/home/store/theme/theme_store.dart';
import 'package:app/presentation/home_tab/store/home_tab_store.dart';
import 'package:app/presentation/login/store/login_store.dart';
import 'package:app/presentation/profile/store/profile_store.dart';
import 'package:app/presentation/settings_tab/store/settings_tab_store.dart';
import 'package:app/presentation/signup/store/signup_store.dart';
import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:cloud_functions/cloud_functions.dart';
import 'package:firebase_auth/firebase_auth.dart';

import '../../../core/stores/error/error_store.dart';
import '../../../di/service_locator.dart';
import '../../../domain/repositories/setting/setting_repository.dart';

class StoreModule {
  static Future<void> configureStoreModuleInjection() async {
    // factories:---------------------------------------------------------------
    getIt.registerFactory(() => ErrorStore());
    getIt.registerFactory(() => FormErrorStore());
    getIt.registerFactory(
      () => FormStore(getIt<FormErrorStore>(), getIt<ErrorStore>()),
    );

    // stores:------------------------------------------------------------------
    getIt.registerLazySingleton(() => ThemeStore(
      getIt<SettingRepository>(),
      getIt<ErrorStore>(),
    ));
    
    getIt.registerLazySingleton(() => LanguageStore(
      getIt<SettingRepository>(),
      getIt<ErrorStore>(),
    ));

    getIt.registerLazySingleton(() => HomeStore(getIt<ErrorStore>()));

    // tabs:------------------------------------------------------------------
    if (!getIt.isRegistered<HomeTabStore>()) {
      getIt.registerLazySingleton<HomeTabStore>(
            () => HomeTabStore(
              getIt<GetRecentEmotionLogsUseCase>(),
              getIt<GetDailyTipUseCase>(),
              auth: getIt<FirebaseAuth>(),
              firestore: getIt<FirebaseFirestore>(),
              firebaseFunctions: getIt<FirebaseFunctions>(),
        ),
      );
    }

    if (!getIt.isRegistered<CalendarTabStore>()) {
      getIt.registerLazySingleton<CalendarTabStore>(
            () => CalendarTabStore(
              getIt<GetEmotionLogsUseCase>(),
              getIt<SaveEmotionLogUseCase>(),
              auth: getIt<FirebaseAuth>(),
              firestore: getIt<FirebaseFirestore>(),
        ),
      );
    }

    if (!getIt.isRegistered<SettingsTabStore>()) {
      getIt.registerLazySingleton<SettingsTabStore>(
            () => SettingsTabStore(
              auth: getIt<FirebaseAuth>(),
              firestore: getIt<FirebaseFirestore>(),
            ),
      );
    }


    // home:------------------------------------------------------------------
    if (!getIt.isRegistered<ProfileStore>()) {
      getIt.registerLazySingleton<ProfileStore>(
            () => ProfileStore(
          getIt<GetCurrentUserUseCase>(),
          getIt<UpdateProfileUseCase>(),
        ),
      );
    }


    // emotion:------------------------------------------------------------------
    if (!getIt.isRegistered<EmotionStore>()) {
      getIt.registerLazySingleton<EmotionStore>(
            () => EmotionStore(
                getIt<ErrorStore>(),
                auth: getIt<FirebaseAuth>(),
                firestore: getIt<FirebaseFirestore>(),
                firebaseFunctions: getIt<FirebaseFunctions>(),
        ),
      );
    }


    // :------------------------------------------------------------------
    getIt.registerLazySingleton(() => UserStore(
      getIt<IsLoggedInUseCase>(),
      getIt<SaveLoginStatusUseCase>(),
      getIt<LoginUseCase>(),
      getIt<FormErrorStore>(),
      getIt<ErrorStore>(),
    ));


    getIt.registerLazySingleton(
      () => SignUpStore(getIt<SignUpUseCase>(), getIt<ErrorStore>()),
    );
    

  }
}
