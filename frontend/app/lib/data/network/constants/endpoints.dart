class Endpoints {
  Endpoints._();

  // base url
  static const String baseUrl = "http://localhost:3000";

  // receiveTimeout
  static const int receiveTimeout = 15000;

  // connectTimeout
  static const int connectionTimeout = 30000;

  //
  static const String authRegister = baseUrl + "/auth/register";
  static const String authLogin = baseUrl + "/auth/login";

  //
  static const String users = '/users';
  static String userById(String id) => '/users/$id';
  static String userRooms(String id) => '/users/$id/rooms';

  //
  static const String getFaqs = baseUrl + "/faq/list?pageRows=10&pageNumber=1&languageType=EN";
  static const String getChats = baseUrl + "/chat/list?pageRows=10&pageNumber=1&languageType=EN";

  static const String chatHistories = baseUrl + "/chat-histories";


}