class PersonaProfileRequest {
  final String userId;
  final String categoryCodeId;
  final String content;
  final bool isStatic;
  final String source;
  final double confidenceScore;

  PersonaProfileRequest({
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
}