import '../entry/point_history.dart';

abstract class PointRepository {
  Future<void> earnPoint(String userId, int amount, String type, {String? description});
  Future<void> usePoint(String userId, int amount, String type, {String? description});
  Future<void> adjustPoint(String userId, int amount, {String? description});
  Future<List<PointHistory>> getPointHistory(String userId);
}
