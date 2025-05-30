class BasicAnswer {
  final String id;
  final String userId;
  final String questionId;
  final String answer;
  final DateTime createdAt;
  final DateTime updatedAt;

  BasicAnswer({
    required this.id,
    required this.userId,
    required this.questionId,
    required this.answer,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BasicAnswer.fromJson(Map<String, dynamic> json) => BasicAnswer(
    id: json['id'],
    userId: json['userId'],
    questionId: json['questionId'],
    answer: json['answer'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );
}
