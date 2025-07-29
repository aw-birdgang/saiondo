class AdviceResponse {
  final String id;
  final String channelId;
  final String advice;
  final DateTime createdAt;

  AdviceResponse({
    required this.id,
    required this.channelId,
    required this.advice,
    required this.createdAt,
  });

  factory AdviceResponse.fromJson(Map<String, dynamic> json) {
    return AdviceResponse(
      id: json['id'],
      channelId: json['channelId'],
      advice: json['advice'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }
}
