import '../../domain/entry/basic_answer.dart';

class BasicAnswerAdapter {
  static BasicAnswer fromJson(Map<String, dynamic> json) => BasicAnswer(
    id: json['id'],
    userId: json['userId'],
    questionId: json['questionId'],
    answer: json['answer'],
    createdAt: DateTime.parse(json['createdAt']),
    updatedAt: DateTime.parse(json['updatedAt']),
  );

  static Map<String, dynamic> toJson(BasicAnswer answer) => {
    'id': answer.id,
    'userId': answer.userId,
    'questionId': answer.questionId,
    'answer': answer.answer,
    'createdAt': answer.createdAt.toIso8601String(),
    'updatedAt': answer.updatedAt.toIso8601String(),
  };
}
