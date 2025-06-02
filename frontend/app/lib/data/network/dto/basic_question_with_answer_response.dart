class BasicQuestionWithAnswerResponse {
  final String id;
  final String categoryId;
  final String question;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final BasicAnswerResponse? answer;

  BasicQuestionWithAnswerResponse({
    required this.id,
    required this.categoryId,
    required this.question,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    this.answer,
  });

  factory BasicQuestionWithAnswerResponse.fromJson(Map<String, dynamic> json) {
    return BasicQuestionWithAnswerResponse(
      id: json['id'] as String? ?? '',
      categoryId: json['categoryId'] as String? ?? '',
      question: json['question'] as String? ?? '',
      description: json['description'] as String?,
      createdAt: _parseDateTime(json['createdAt']),
      updatedAt: _parseDateTime(json['updatedAt']),
      answer: json['answer'] != null
          ? BasicAnswerResponse.fromJson(json['answer'])
          : null,
    );
  }
}

class BasicAnswerResponse {
  final String id;
  final String userId;
  final String questionId;
  final String answer;
  final DateTime createdAt;
  final DateTime updatedAt;

  BasicAnswerResponse({
    required this.id,
    required this.userId,
    required this.questionId,
    required this.answer,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BasicAnswerResponse.fromJson(Map<String, dynamic> json) {
    return BasicAnswerResponse(
      id: json['id'] as String? ?? '',
      userId: json['userId'] as String? ?? '',
      questionId: json['questionId'] as String? ?? '',
      answer: json['answer'] as String? ?? '',
      createdAt: _parseDateTime(json['createdAt']),
      updatedAt: _parseDateTime(json['updatedAt']),
    );
  }
}

// 안전한 DateTime 파싱 함수
DateTime _parseDateTime(dynamic value) {
  if (value == null || (value is String && value.isEmpty)) {
    return DateTime.fromMillisecondsSinceEpoch(0); // 기본값(1970-01-01)
  }
  if (value is DateTime) return value;
  return DateTime.parse(value as String);
}
