import 'dart:io';

class Endpoints {
  Endpoints._();

  // base url
  static String get baseUrl {
    if (Platform.isAndroid) {
      // Android 에뮬레이터에서 호스트 PC로 접근
      return 'http://10.0.2.2:3000';
    } else {
      // iOS 시뮬레이터, 웹, 데스크탑 등
      return 'http://localhost:3000';
    }
  }

  // receiveTimeout
  static const int receiveTimeout = 15000;

  // connectTimeout
  static const int connectionTimeout = 30000;

  //
  static String authRegister = baseUrl + "/auth/register";
  static String authLogin = baseUrl + "/auth/login";

  //
  static const String users = '/users';
  static String userById(String id) => '/users/$id';
  static String userAssistants(String id) => '/users/$id/assistants';
  static String userFcmToken(String id) => '/users/$id/fcm-token';

  static String personaProfiles(String userId) =>
      '/persona-profiles/user/$userId';
  static String createPersonaProfile(String userId) =>
      '/persona-profiles/user/$userId';
  static String updatePersonaProfile(String userId, String categoryCodeId) =>
      '/persona-profiles/user/$userId/category/$categoryCodeId';
  static String deletePersonaProfile(String userId, String categoryCodeId) =>
      '/persona-profiles/user/$userId/category/$categoryCodeId';

  // Channel (커플 단위)
  static const String channels = '/channels';
  static String channelById(String id) => '/channels/$id';
  static String channelByUserId(String userId) => '/channels/by-user/$userId';
  static String inviteCode(String id) => '/channels/$id/inviteCode';
  static String accept(String id) => '/channels/$id/accept';
  static String reject(String id) => '/channels/$id/reject';
  static String members(String channelId) => '/channels/$channelId/members';
  static String memberById(String channelId, String userId) =>
      '/channels/$channelId/members/$userId';
  static const String cleanup = '/channels/cleanup';
  static String deleteChannel(String id) => '/channels/$id';
  static const String joinByInvite = '/channels/join-by-invite';
  static const String leaveChannel = '/channels/leave';
  static String invitationsForUser(String userId) =>
      '/users/$userId/invitations';
  static String respondInvitation(String invitationId) =>
      '/invitations/$invitationId/respond';

  // 초대장 생성 (POST)
  static String invite(String channelId) => '/channels/$channelId/invite';

  // 특정 채널에 대해 해당 유저에게 pending 초대장이 있는지 확인 (GET)
  static String hasPendingInvitation(String channelId, String inviteeId) =>
      '/channels/$channelId/invitations/pending/$inviteeId';

  // Assistant (채널 하위, 유저별 1:1)
  static String get assistants => '$baseUrl/assistants';
  static String assistantById(String assistantId) =>
      '$baseUrl/assistants/$assistantId';
  static String assistantsByUser(String userId) =>
      '$baseUrl/assistants/user/$userId';

  // event
  static String get events => '$baseUrl/events';
  static String eventById(String id) => '/events/$id';
  static String eventByUserId(String userId) => '/events/user$userId';

  // point
  static String pointEarn(String userId) => '/point/$userId/earn';
  static String pointUse(String userId) => '/point/$userId/use';
  static String pointAdjust(String userId) => '/point/$userId/adjust';
  static String pointHistory(String userId) => '/point/$userId/history';

  // couple analysis
  static String coupleAnalysisByChannelId(String channelId) =>
      '$baseUrl/couple-analysis/$channelId';
  static String coupleAnalysisByChannelIdLatest(String channelId) =>
      '$baseUrl/couple-analysis/$channelId/latest';
  static String coupleAnalysisLlm(String channelId) =>
      '$baseUrl/couple-analysis/$channelId/llm';

  //
  static String adviceHistories(String channelId) =>
      '/advice/channel/$channelId';
  static String adviceHistoryLatest(String channelId) =>
      '/advice/channel/$channelId/latest';

  // 채팅 내역 조회 (내 방 기준)
  static String chatHistory(String channelId, String userId) =>
      '$baseUrl/chat/$channelId/$userId/history';

  // 메시지 전송 (내 방 기준)
  static String sendMessage(String channelId, String userId) =>
      '$baseUrl/chat/$channelId/$userId/message';

  static String getChats =
      baseUrl + '/chat/list?pageRows=10&pageNumber=1&languageType=EN';

  static String chat = baseUrl + "/chat";
  static String chatHistories(String assistantId) =>
      '$baseUrl/chat/$assistantId/histories';

  //
  static String getCategoryCodes = baseUrl + '/category-codes';

  static const String paymentSubscription = '/payment_subscription';
  static const String paymentSubscriptionCurrent =
      '/payment-subscription/current';
  static const String paymentSubscriptionVerify =
      '/payment-subscription/verify';
  static const String paymentSubscriptionSave = '/payment-subscription/save';
  static const String paymentSubscriptionHistories =
      '/payment-subscription/subscription-histories';
  static String paymentSubscriptionHistoriesByUser(String userId) =>
      '/payment-subscription/$userId/subscription-histories';
}
