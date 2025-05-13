class PersonaProfileRequest {
  final String categoryCodeId;
  final String content;
  final double confidenceScore;

  PersonaProfileRequest({
    required this.categoryCodeId,
    required this.content,
    required this.confidenceScore,
  });

  Map<String, dynamic> toJson() => {
    'categoryCodeId': categoryCodeId,
    'content': content,
    'confidenceScore': confidenceScore,
  };
}