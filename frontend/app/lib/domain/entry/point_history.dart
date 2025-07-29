import '../../data/network/dto/point_history_response.dart';

class PointHistory {
  final int amount;
  final String type;
  final String? description;
  final DateTime createdAt;

  PointHistory({
    required this.amount,
    required this.type,
    this.description,
    required this.createdAt,
  });

  factory PointHistory.fromResponse(PointHistoryResponse res) => PointHistory(
        amount: res.amount,
        type: res.type,
        description: res.description,
        createdAt: res.createdAt,
      );
}
