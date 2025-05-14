class PersonaProfileResponse {
  final String userId;
  final String categoryCodeId;
  final String content;
  final bool isStatic;
  final String source;
  final double confidenceScore;

  PersonaProfileResponse({
    required this.userId,
    required this.categoryCodeId,
    required this.content,
    required this.isStatic,
    required this.source,
    required this.confidenceScore,
  });

  factory PersonaProfileResponse.fromJson(Map<String, dynamic> json) {
    return PersonaProfileResponse(
      userId: json['userId'] as String,
      categoryCodeId: json['categoryCodeId'] as String,
      content: json['content'] as String,
      isStatic: json['isStatic'] as bool? ?? false,
      source: json['source'] as String,
      confidenceScore: (json['confidenceScore'] as num).toDouble(),
    );
  }
}
