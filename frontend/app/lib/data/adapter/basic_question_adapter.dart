import '../../domain/entry/basic_question.dart';

class BasicQuestionAdapter {
  static BasicQuestion fromJson(Map<String, dynamic> json) => BasicQuestion(
    id: json['id'],
    question: json['question'],
    description: json['description'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );
}
