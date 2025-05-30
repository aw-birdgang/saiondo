import '../../domain/repository/point_repository.dart';
import '../../domain/entry/point_history.dart';
import '../network/apis/point_api.dart';
import '../network/dto/point_request.dart';
import '../adapter/point_history_adapter.dart';

class PointRepositoryImpl implements PointRepository {
  final PointApi _pointApi;

  PointRepositoryImpl(this._pointApi);

  @override
  Future<void> earnPoint(String userId, int amount, String type, {String? description}) async {
    final req = PointRequest(amount: amount, type: type, description: description);
    await _pointApi.earnPoint(userId, req);
  }

  @override
  Future<void> usePoint(String userId, int amount, String type, {String? description}) async {
    final req = PointRequest(amount: amount, type: type, description: description);
    await _pointApi.usePoint(userId, req);
  }

  @override
  Future<void> adjustPoint(String userId, int amount, {String? description}) async {
    final req = PointRequest(amount: amount, type: 'ADMIN_ADJUST', description: description);
    await _pointApi.adjustPoint(userId, req);
  }

  @override
  Future<List<PointHistory>> getPointHistory(String userId) async {
    final resList = await _pointApi.getPointHistory(userId);
    return PointHistoryAdapter.fromResponseList(resList);
  }
}
