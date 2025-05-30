import '../../../core/data/network/dio/dio_client.dart';
import '../constants/endpoints.dart';
import '../dto/point_history_response.dart';
import '../dto/point_request.dart';
import '../rest_client.dart';

class PointApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  PointApi(this._dioClient, this._restClient);

  Future<void> earnPoint(String userId, PointRequest req) async {
    await _dioClient.dio.post(Endpoints.pointEarn(userId), data: req.toJson());
  }

  Future<void> usePoint(String userId, PointRequest req) async {
    await _dioClient.dio.post(Endpoints.pointUse(userId), data: req.toJson());
  }

  Future<void> adjustPoint(String userId, PointRequest req) async {
    await _dioClient.dio.post(Endpoints.pointAdjust(userId), data: req.toJson());
  }

  Future<List<PointHistoryResponse>> getPointHistory(String userId) async {
    final res = await _dioClient.dio.get(Endpoints.pointHistory(userId));
    return (res.data as List)
        .map((e) => PointHistoryResponse.fromJson(e))
        .toList();
  }
}
