import 'basic_answer.dart';

class BasicQuestionWithAnswer {
  final String id;
  final String categoryId;
  final String question;
  final String? description;
  final DateTime createdAt;
  final DateTime updatedAt;
  final BasicAnswer? answer;

  BasicQuestionWithAnswer({
    required this.id,
    required this.categoryId,
    required this.question,
    this.description,
    required this.createdAt,
    required this.updatedAt,
    this.answer,
  });

  factory BasicQuestionWithAnswer.fromJson(Map<String, dynamic> json) => BasicQuestionWithAnswer(
    id: json['id'],
    categoryId: json['categoryId'],
    question: json['question'],
    description: json['description'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
    answer: json['answer'] != null ? BasicAnswer.fromJson(json['answer']) : null,
  );
}