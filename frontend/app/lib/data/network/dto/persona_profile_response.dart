class PersonaProfileResponse {
  final String categoryCodeId;
  final String content;
  final double confidenceScore;

  PersonaProfileResponse({
    required this.categoryCodeId,
    required this.content,
    required this.confidenceScore,
  });

  factory PersonaProfileResponse.fromJson(Map<String, dynamic> json) {
    return PersonaProfileResponse(
      categoryCodeId: json['categoryCodeId'] ?? '',
      content: json['content'] ?? '',
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
