import 'dart:async';
import 'package:dio/dio.dart';

class RetryInterceptor extends Interceptor {
  final Dio dio;
  final RetryOptions options;
  final bool shouldLog;

  RetryInterceptor(
      {required this.dio, RetryOptions? options, this.shouldLog = true})
      : this.options = options ?? const RetryOptions();

  @override
  void onError(DioException err, ErrorInterceptorHandler handler) async {
    var extra = RetryOptions.fromExtra(err.requestOptions, options);

    var shouldRetry = extra.retries > 0 && await options.retryEvaluator(err);
    if (!shouldRetry) {
      return super.onError(err, handler);
    }

    if (extra.retryInterval.inMilliseconds > 0) {
      await Future.delayed(extra.retryInterval);
    }

    // Update options to decrease retry count before new try
    extra = extra.copyWith(retries: extra.retries - 1);
    err.requestOptions.extra = err.requestOptions.extra
      ..addAll(extra.toExtra());

    if (shouldLog) {
      print('[${err.requestOptions.uri}] An error occurred during request, trying again (remaining tries: ${extra.retries}, error: ${err.error})');
    }

    // We retry with the updated options
    await dio.request(
      err.requestOptions.path,
      cancelToken: err.requestOptions.cancelToken,
      data: err.requestOptions.data,
      onReceiveProgress: err.requestOptions.onReceiveProgress,
      onSendProgress: err.requestOptions.onSendProgress,
      queryParameters: err.requestOptions.queryParameters,
      options: err.requestOptions.toOptions(),
    ).then((value) => handler.resolve(value), onError: (error) => handler.reject(error));
  }
}

typedef FutureOr<bool> RetryEvaluator(DioException error);

extension RequestOptionsExtensions on RequestOptions {
  Options toOptions() {
    return Options(
      method: method,
      sendTimeout: sendTimeout,
      receiveTimeout: receiveTimeout,
      extra: extra,
      headers: headers,
      responseType: responseType,
      contentType: contentType,
      validateStatus: validateStatus,
      receiveDataWhenStatusError: receiveDataWhenStatusError,
      followRedirects: followRedirects,
      maxRedirects: maxRedirects,
      requestEncoder: requestEncoder,
      responseDecoder: responseDecoder,
      listFormat: listFormat,
    );
  }
}

class RetryOptions {
  final int retries;
  final Duration retryInterval;

  RetryEvaluator get retryEvaluator => this._retryEvaluator ?? defaultRetryEvaluator;

  final RetryEvaluator? _retryEvaluator;

  const RetryOptions(
      {this.retries = 3,
        RetryEvaluator? retryEvaluator,
        this.retryInterval = const Duration(seconds: 1)})
      : this._retryEvaluator = retryEvaluator;

  factory RetryOptions.noRetry() {
    return RetryOptions(
      retries: 0,
    );
  }

  static const extraKey = "cache_retry_request";

  static FutureOr<bool> defaultRetryEvaluator(DioException error) {
    final cancelError = error.type != DioExceptionType.cancel;
    final shouldRetry = cancelError;
    return shouldRetry;
  }

  factory RetryOptions.fromExtra(RequestOptions request, RetryOptions defaultOptions) {
    return request.extra[extraKey] ?? defaultOptions;
  }

  RetryOptions copyWith({
    int? retries,
    Duration? retryInterval,
  }) =>
      RetryOptions(
        retries: retries ?? this.retries,
        retryInterval: retryInterval ?? this.retryInterval,
      );

  Map<String, dynamic> toExtra() => {extraKey: this};

  Options toOptions() => Options(extra: this.toExtra());

  Options mergeIn(Options options) {
    return options.copyWith(
        extra: <String, dynamic>{}
          ..addAll(options.extra ?? {})
          ..addAll(this.toExtra()));
  }

  @override
  String toString() {
    return 'RetryOptions{retries: $retries, retryInterval: $retryInterval, _retryEvaluator: $_retryEvaluator}';
  }
}