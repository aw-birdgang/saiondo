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
  static String userRooms(String id) => '/users/$id/rooms';

  static String personaProfile(String userId) => '/persona-profiles/$userId';
  static String personaProfiles(String userId) => '/persona-profiles/user/$userId';
  static String createPersonaProfile(String userId) => '/persona-profiles/$userId';
  static String updatePersonaProfile(String userId, String categoryCodeId) => '/persona-profiles/$userId/$categoryCodeId';

  //
  static String getFaqs = baseUrl + "/faq/list?pageRows=10&pageNumber=1&languageType=EN";
  static String getChats = baseUrl + "/chat/list?pageRows=10&pageNumber=1&languageType=EN";

  static String chatHistories = baseUrl + "/chat-histories";
  static String chat = baseUrl + "/chat";

}