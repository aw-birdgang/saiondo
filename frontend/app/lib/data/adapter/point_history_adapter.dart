import '../../domain/entry/point_history.dart';
import '../network/dto/point_history_response.dart';

class PointHistoryAdapter {
  static PointHistory fromResponse(PointHistoryResponse res) => PointHistory(
        amount: res.amount,
        type: res.type,
        description: res.description,
        createdAt: res.createdAt,
      );

  static List<PointHistory> fromResponseList(List<PointHistoryResponse> list) =>
      list.map(fromResponse).toList();
}
