class Endpoints {
  Endpoints._();

  // base url
  static const String baseUrl = "https://member-api.develop.happy545.com";

  // receiveTimeout
  static const int receiveTimeout = 15000;

  // connectTimeout
  static const int connectionTimeout = 30000;

  // booking endpoints
  static const String getFaqs = baseUrl + "/v1/faq/list?pageRows=10&pageNumber=1&languageType=EN";

}