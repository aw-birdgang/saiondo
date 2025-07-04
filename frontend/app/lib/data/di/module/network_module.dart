import 'package:saiondo/data/network/apis/advice_api.dart';
import 'package:saiondo/data/network/apis/chst_api.dart';
import 'package:event_bus/event_bus.dart';

import '../../../core/data/network/dio/configs/dio_configs.dart';
import '../../../core/data/network/dio/dio_client.dart';
import '../../../core/data/network/dio/interceptors/logging_interceptor.dart';
import '../../../di/service_locator.dart';
import '../../network/apis/analysis_api.dart';
import '../../network/apis/assistant_api.dart';
import '../../network/apis/auth_api.dart';
import '../../network/apis/basic_question_with_answer_api.dart';
import '../../network/apis/category_code_api.dart';
import '../../network/apis/channel_api.dart';
import '../../network/apis/chat_history_api.dart';
import '../../network/apis/event_api.dart';
import '../../network/apis/payment_subscription_api.dart';
import '../../network/apis/point_api.dart';
import '../../network/apis/user_api.dart';
import '../../network/constants/endpoints.dart';
import '../../network/interceptors/error_interceptor.dart';
import '../../network/rest_client.dart';
import '../../network/socket_io/socket_io_service.dart';

class NetworkModule {
  static Future<void> configureNetworkModuleInjection() async {
    // event bus:---------------------------------------------------------------
    getIt.registerSingleton<EventBus>(EventBus());

    // interceptors:------------------------------------------------------------
    getIt.registerSingleton<LoggingInterceptor>(LoggingInterceptor());
    getIt.registerSingleton<ErrorInterceptor>(ErrorInterceptor(getIt()));

    // rest client:-------------------------------------------------------------
    getIt.registerSingleton(RestClient());

    // dio:---------------------------------------------------------------------
    getIt.registerSingleton<DioConfigs>(
      DioConfigs(
        baseUrl: Endpoints.baseUrl,
        connectionTimeout: Endpoints.connectionTimeout,
        receiveTimeout:Endpoints.receiveTimeout,
      ),
    );
    getIt.registerSingleton<DioClient>(
      DioClient(dioConfigs: getIt())
        ..addInterceptors(
          [
            getIt<ErrorInterceptor>(),
            getIt<LoggingInterceptor>(),
          ],
        ),
    );

    // service's:-------------------------------------------------------------------
    getIt.registerLazySingleton<SocketIoService>(
          () => SocketIoService(url: 'http://10.0.2.2:3000'),
    );

    // api's:-------------------------------------------------------------------
    getIt.registerSingleton(UserApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(AuthApi(getIt<DioClient>(), getIt<RestClient>()));

    getIt.registerSingleton(ChannelApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(AssistantApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(ChatApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(ChatHistoryApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(PointApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(BasicQuestionWithAnswerApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(EventApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(AnalysisApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(AdviceApi(getIt<DioClient>(), getIt<RestClient>()));
    getIt.registerSingleton(CategoryCodeApi(getIt<DioClient>(), getIt<RestClient>()));
    //
    getIt.registerSingleton(PaymentSubscriptionApi(getIt<DioClient>(), getIt<RestClient>()));
  }
}
