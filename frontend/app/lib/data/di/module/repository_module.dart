import 'dart:async';

import 'package:saiondo/data/repository/setting_repository_impl.dart';
import 'package:saiondo/data/sharedpref/shared_preference_helper.dart';
import 'package:saiondo/di/service_locator.dart';
import 'package:saiondo/domain/repository/setting_repository.dart';

import '../../../domain/repository/advice_repository.dart';
import '../../../domain/repository/analysis_repository.dart';
import '../../../domain/repository/assitant_repository.dart';
import '../../../domain/repository/auth_repository.dart';
import '../../../domain/repository/basic_question_category_repository.dart';
import '../../../domain/repository/basic_question_repository.dart';
import '../../../domain/repository/basic_question_with_answer_repository.dart';
import '../../../domain/repository/channel_repository.dart';
import '../../../domain/repository/chat_history_repository.dart';
import '../../../domain/repository/event_repository.dart';
import '../../../domain/repository/payment_subscription_repository.dart';
import '../../../domain/repository/point_repository.dart';
import '../../../domain/repository/user_repository.dart';
import '../../network/apis/advice_api.dart';
import '../../network/apis/analysis_api.dart';
import '../../network/apis/assistant_api.dart';
import '../../network/apis/auth_api.dart';
import '../../network/apis/basic_question_with_answer_api.dart';
import '../../network/apis/channel_api.dart';
import '../../network/apis/chat_history_api.dart';
import '../../network/apis/event_api.dart';
import '../../network/apis/payment_subscription_api.dart';
import '../../network/apis/point_api.dart';
import '../../network/apis/user_api.dart';
import '../../repository/advice_repository_impl.dart';
import '../../repository/analysis_repository_impl.dart';
import '../../repository/assistant_repository_impl.dart';
import '../../repository/auth_repository_impl.dart';
import '../../repository/basic_question_category_repository_impl.dart';
import '../../repository/basic_question_repository_impl.dart';
import '../../repository/basic_question_with_answer_repository_impl.dart';
import '../../repository/channel_repository_impl.dart';
import '../../repository/chat_history_repository_impl.dart';
import '../../repository/event_repository_impl.dart';
import '../../repository/payment_subscription_repository_impl.dart';
import '../../repository/point_repository_impl.dart';
import '../../repository/user_repository_impl.dart';

class RepositoryModule {
  static Future<void> configureRepositoryModuleInjection() async {
    // repository:--------------------------------------------------------------
    getIt.registerSingleton<SettingRepository>(SettingRepositoryImpl(
      getIt<SharedPreferenceHelper>(),
    ));

    final chatHistoryRepoImpl =
        ChatHistoryRepositoryImpl(getIt<ChatHistoryApi>());
    // 인터페이스와 구현체 모두 등록
    getIt.registerSingleton<ChatHistoryRepository>(chatHistoryRepoImpl);
    getIt.registerSingleton<ChatHistoryRepositoryImpl>(chatHistoryRepoImpl);

    // auth repository 등록
    getIt.registerSingleton<AuthRepository>(AuthRepositoryImpl(
      getIt<AuthApi>(),
      getIt<SharedPreferenceHelper>(),
    ));

    // user repository 등록
    getIt.registerSingleton<UserRepository>(
        UserRepositoryImpl(getIt<UserApi>(), getIt<SharedPreferenceHelper>()));

    getIt.registerSingleton<ChannelRepository>(ChannelRepositoryImpl(
      getIt<ChannelApi>(),
    ));

    getIt.registerSingleton<PointRepository>(PointRepositoryImpl(
      getIt<PointApi>(),
    ));

    getIt.registerSingleton<BasicQuestionCategoryRepository>(
        BasicQuestionCategoryRepositoryImpl(
      getIt<BasicQuestionWithAnswerApi>(),
    ));

    getIt
        .registerSingleton<BasicQuestionRepository>(BasicQuestionRepositoryImpl(
      getIt<BasicQuestionWithAnswerApi>(),
    ));

    getIt.registerSingleton<BasicQuestionWithAnswerRepository>(
        BasicQuestionWithAnswerRepositoryImpl(
      getIt<BasicQuestionWithAnswerApi>(),
    ));

    getIt.registerSingleton<EventRepository>(EventRepositoryImpl(
      getIt<EventApi>(),
    ));

    getIt.registerSingleton<AssistantRepository>(AssistantRepositoryImpl(
      getIt<AssistantApi>(),
    ));

    getIt.registerSingleton<AnalysisRepository>(AnalysisRepositoryImpl(
      getIt<AnalysisApi>(),
    ));

    getIt.registerSingleton<AdviceRepository>(AdviceRepositoryImpl(
      getIt<AdviceApi>(),
    ));

    getIt.registerSingleton<PaymentSubscriptionRepository>(
        PaymentSubscriptionRepositoryImpl(
      getIt<PaymentSubscriptionApi>(),
    ));
  }
}
