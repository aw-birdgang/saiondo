import '../../domain/entry/basic_answer.dart';
import '../network/dto/basic_question_with_answer_response.dart';

class BasicAnswerAdapter {
  static BasicAnswer fromResponse(BasicAnswerResponse res) => BasicAnswer(
    id: res.id,
    userId: res.userId,
    questionId: res.questionId,
    answer: res.answer,
    createdAt: res.createdAt, // 또는 DateTime.parse(res.createdAt)
    updatedAt: res.updatedAt, // 또는 DateTime.parse(res.updatedAt)
  );

  static Map<String, dynamic> toJson(BasicAnswer answer) => {
    'id': answer.id,
    'userId': answer.userId,
    'questionId': answer.questionId,
    'answer': answer.answer,
    'createdAt': answer.createdAt is DateTime
        ? answer.createdAt.toIso8601String()
        : answer.createdAt,
    'updatedAt': answer.updatedAt is DateTime
        ? answer.updatedAt.toIso8601String()
        : answer.updatedAt,
  };
}