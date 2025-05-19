import 'package:dio/dio.dart';

import 'configs/dio_configs.dart';

class DioClient {
  final DioConfigs dioConfigs;
  final Dio _dio;

  DioClient({required this.dioConfigs})
      : _dio = Dio()
    ..options.baseUrl = dioConfigs.baseUrl
    ..options.connectTimeout = Duration(milliseconds: dioConfigs.connectionTimeout)
    ..options.receiveTimeout = Duration(milliseconds: dioConfigs.receiveTimeout) {
    // 요청/응답 로깅 인터셉터 추가
    _dio.interceptors.add(InterceptorsWrapper(
      onRequest: (options, handler) {
        print('[DIO][REQUEST] ${options.method} ${options.baseUrl}${options.path}');
        if (options.queryParameters.isNotEmpty) {
          print('[DIO][REQUEST][QUERY] ${options.queryParameters}');
        }
        if (options.data != null) {
          print('[DIO][REQUEST][BODY] ${options.data}');
        }
        return handler.next(options);
      },
      onResponse: (response, handler) {
        print('[DIO][RESPONSE] ${response.statusCode} ${response.requestOptions.baseUrl}${response.requestOptions.path}');
        return handler.next(response);
      },
      onError: (DioException e, handler) {
        print('[DIO][ERROR] ${e.requestOptions.method} ${e.requestOptions.baseUrl}${e.requestOptions.path}');
        print('[DIO][ERROR][DETAIL] ${e.message}');
        return handler.next(e);
      },
    ));
  }

  Dio get dio => _dio;

  Dio addInterceptors(Iterable<Interceptor> interceptors) {
    return _dio..interceptors.addAll(interceptors);
  }
}