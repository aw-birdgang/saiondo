class BasicQuestionResponse {
  final String id;
  final String question;
  final String? description;
  final String categoryId;

  BasicQuestionResponse({
    required this.id,
    required this.question,
    this.description,
    required this.categoryId,
  });

  factory BasicQuestionResponse.fromJson(Map<String, dynamic> json) =>
      BasicQuestionResponse(
        id: json['id'],
        question: json['question'],
        description: json['description'],
        categoryId: json['categoryId'],
      );
}
