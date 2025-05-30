class PointRequest {
  final int amount;
  final String type; // PointType
  final String? description;

  PointRequest({required this.amount, required this.type, this.description});

  Map<String, dynamic> toJson() => {
    'amount': amount,
    'type': type,
    if (description != null) 'description': description,
  };
}
