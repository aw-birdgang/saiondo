import 'dart:async';

import 'package:flutter/foundation.dart';
import 'package:saiondo/core/data/local/sembast/sembast_client.dart';
import 'package:saiondo/data/local/constants/db_constants.dart';
import 'package:saiondo/data/local/datasources/faq_datasource.dart';
import 'package:saiondo/data/sharedpref/shared_preference_helper.dart';
import 'package:logger/logger.dart';
import 'package:path_provider/path_provider.dart';
import 'package:shared_preferences/shared_preferences.dart';

import '../../../di/service_locator.dart';
import '../../local/datasources/chat_history_datasource.dart';

class LocalModule {
  static Future<void> configureLocalModuleInjection() async {
    // preference manager:------------------------------------------------------
    getIt.registerSingletonAsync<SharedPreferences>(SharedPreferences.getInstance);
    getIt.registerSingleton<SharedPreferenceHelper>(
      SharedPreferenceHelper(await getIt.getAsync<SharedPreferences>()),
    );

    // database:----------------------------------------------------------------
    getIt.registerSingletonAsync<SembastClient>(
          () async => SembastClient.provideDatabase(
        databaseName: DBConstants.DB_NAME,
        databasePath: kIsWeb
            ? "/assets/db"
            : (await getApplicationDocumentsDirectory()).path,
      ),
    );

    // data sources:------------------------------------------------------------
    getIt.registerSingleton(FaqDataSource(await getIt.getAsync<SembastClient>()));
    getIt.registerSingleton(ChatHistoryDataSource(await getIt.getAsync<SembastClient>()));

    // logger:------------------------------------------------------------------
    getIt.registerSingleton<Logger>(
      Logger(
        printer: PrettyPrinter(
          methodCount: 2,
          errorMethodCount: 8,
          lineLength: 120,
          colors: true,
          printEmojis: true,
          printTime: true,
        ),
      ),
    );

  }
}