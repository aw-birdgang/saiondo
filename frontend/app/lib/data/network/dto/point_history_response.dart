class PointHistoryResponse {
  final int amount;
  final String type;
  final String? description;
  final DateTime createdAt;

  PointHistoryResponse({
    required this.amount,
    required this.type,
    this.description,
    required this.createdAt,
  });

  factory PointHistoryResponse.fromJson(Map<String, dynamic> json) {
    return PointHistoryResponse(
      amount: json['amount'],
      type: json['type'],
      description: json['description'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
