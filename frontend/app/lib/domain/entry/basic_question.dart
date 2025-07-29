class BasicQuestion {
  final String id;
  final String question;
  final String? description;
  final String categoryId;

  BasicQuestion({
    required this.id,
    required this.question,
    this.description,
    required this.categoryId,
  });

  factory BasicQuestion.fromJson(Map<String, dynamic> json) => BasicQuestion(
        id: json['id'],
        question: json['question'],
        description: json['description'],
        categoryId: json['categoryId'],
      );
}
