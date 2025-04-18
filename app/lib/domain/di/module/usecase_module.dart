import 'dart:async';

import 'package:app/di/service_locator.dart';

import '../../repository/user/user_repository.dart';
import '../../usecase/user/is_logged_in_usecase.dart';
import '../../usecase/user/login_usecase.dart';
import '../../usecase/user/save_login_in_status_usecase.dart';


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

  }
}
