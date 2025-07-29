import 'package:dio/dio.dart';

class DioExceptionUtil {
  // general methods:-----------------------------------------------------------
  static String handleError(DioException error) {
    String errorDescription = "";
    if (error is DioException) {
      switch (error.type) {
        case DioExceptionType.cancel:
          errorDescription = "Request to API server was cancelled";
          break;
        case DioExceptionType.connectionError:
          errorDescription = "Connection error with API server";
          break;
        case DioExceptionType.connectionTimeout:
          errorDescription = "Connection timeout with API server";
          break;
        case DioExceptionType.receiveTimeout:
          errorDescription = "Receive timeout in connection with API server";
          break;
        case DioExceptionType.badResponse:
          errorDescription =
              "Received invalid status code: ${error.response?.statusCode}";
          break;
        case DioExceptionType.sendTimeout:
          errorDescription = "Send timeout in connection with API server";
          break;
        case DioExceptionType.badCertificate:
          errorDescription = "Incorrect certificate";
          break;
        case DioExceptionType.unknown:
          errorDescription = "Unexpected error occurred";
          break;
      }
    } else {
      errorDescription = "Unexpected error occurred";
    }
    return errorDescription;
  }
}
