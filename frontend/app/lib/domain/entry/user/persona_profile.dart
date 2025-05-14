class PersonaProfile {
  final String userId;
  final String categoryCodeId;
  final String content;
  final bool isStatic;
  final String source;
  final double confidenceScore;

  PersonaProfile({
    required this.userId,
    required this.categoryCodeId,
    required this.content,
    required this.isStatic,
    required this.source,
    required this.confidenceScore,
  });

  Map<String, dynamic> toJson() => {
    'userId': userId,
    'categoryCodeId': categoryCodeId,
    'content': content,
    'isStatic': isStatic,
    'source': source,
    'confidenceScore': confidenceScore,
  };

  factory PersonaProfile.fromJson(Map<String, dynamic> json) {
    return PersonaProfile(
      userId: json['userId'] ?? '',
      categoryCodeId: json['categoryCodeId'] ?? '',
      content: json['content'] ?? '',
      isStatic: json['isStatic'] ?? false,
      source: json['source'] ?? '',
      confidenceScore: (json['confidenceScore'] as num?)?.toDouble() ?? 0.0,
    );
  }
}
