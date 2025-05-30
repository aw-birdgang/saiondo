class BasicQuestion {
  final String id;
  final String question;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;

  BasicQuestion({
    required this.id,
    required this.question,
    this.description,
    required this.createdAt,
    required this.updatedAt,
  });

  factory BasicQuestion.fromJson(Map<String, dynamic> json) => BasicQuestion(
    id: json['id'],
    question: json['question'],
    description: json['description'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );
}