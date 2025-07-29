import 'package:dio/dio.dart';
import 'package:logger/logger.dart';

import 'configs/dio_configs.dart';

class DioClient {
  final DioConfigs dioConfigs;
  final Dio _dio;
  final Logger _logger = Logger();

  DioClient({required this.dioConfigs})
      : _dio = Dio()
          ..options.baseUrl = dioConfigs.baseUrl
          ..options.connectTimeout =
              Duration(milliseconds: dioConfigs.connectionTimeout)
          ..options.receiveTimeout =
              Duration(milliseconds: dioConfigs.receiveTimeout) {
    // 요청/응답 로깅 인터셉터 추가
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        _logger.d(
            '[DIO][REQUEST] ${options.method} ${options.baseUrl}${options.path}');
        if (options.queryParameters.isNotEmpty) {
          _logger.d('[DIO][REQUEST][QUERY] ${options.queryParameters}');
        }
        if (options.data != null) {
          _logger.d('[DIO][REQUEST][BODY] ${options.data}');
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        _logger.d(
            '[DIO][RESPONSE] ${response.statusCode} ${response.requestOptions.baseUrl}${response.requestOptions.path}');
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        _logger.e(
            '[DIO][ERROR] ${e.requestOptions.method} ${e.requestOptions.baseUrl}${e.requestOptions.path}');
        _logger.e('[DIO][ERROR][DETAIL] ${e.message}');
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;

  Dio addInterceptors(Iterable<Interceptor> interceptors) {
    return _dio..interceptors.addAll(interceptors);
  }
}
