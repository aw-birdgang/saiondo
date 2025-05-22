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

  static String personaProfiles(String userId) => '/persona-profiles/user/$userId';
  static String createPersonaProfile(String userId) => '/persona-profiles/user/$userId';
  static String updatePersonaProfile(String userId, String categoryCodeId) => '/persona-profiles/user/$userId/category/$categoryCodeId';
  static String deletePersonaProfile(String userId, String categoryCodeId) => '/persona-profiles/user/$userId/category/$categoryCodeId';

  // Channel (커플 단위)
  static String get channels => '$baseUrl/channels';
  static String channelById(String channelId) => '$baseUrl/channels/$channelId';
  static String channelByInviteCode(String channelId) => '$baseUrl/channels/$channelId/inviteCode';

  // Assistant (채널 하위, 유저별 1:1)
  static String get assistants => '$baseUrl/assistants';
  static String assistantById(String assistantId) => '$baseUrl/assistants/$assistantId';
  static String assistantsByUser(String userId) => '$baseUrl/assistants/user/$userId';

  // couple analysis
  static String coupleAnalysisByChannelId(String channelId) => '$baseUrl/couple-analysis/$channelId';
  static String coupleAnalysisByChannelIdLatest(String channelId) => '$baseUrl/couple-analysis/$channelId/latest';
  static String coupleAnalysisLlm(String channelId) => '$baseUrl/couple-analysis/$channelId/llm';

  //
  static String advices(String channelId) => '/couple-analysis/$channelId/advice-history';

  // 채팅 내역 조회 (내 방 기준)
  static String chatHistory(String channelId, String userId) =>
      '$baseUrl/chat/$channelId/$userId/history';

  // 메시지 전송 (내 방 기준)
  static String sendMessage(String channelId, String userId) =>
      '$baseUrl/chat/$channelId/$userId/message';

  static String getChats = baseUrl + '/chat/list?pageRows=10&pageNumber=1&languageType=EN';

  static String chatHistories = baseUrl + "/chat-histories";
  static String chat = baseUrl + "/chat";

  //
  static String getCategoryCodes = baseUrl + '/category-codes';
}