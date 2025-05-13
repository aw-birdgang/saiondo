class PersonaProfile {
  final String categoryCodeId;
  final String content;
  final double confidenceScore;

  PersonaProfile({
    required this.categoryCodeId,
    required this.content,
    required this.confidenceScore,
  });

  factory PersonaProfile.fromJson(Map<String, dynamic> json) {
    return PersonaProfile(
      categoryCodeId: json['categoryCodeId'] ?? '',
      content: json['content'] ?? '',
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
