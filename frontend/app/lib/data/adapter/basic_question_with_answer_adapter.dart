import '../../domain/entry/basic_question_with_answer.dart';
import '../network/dto/basic_question_with_answer_response.dart';
import 'basic_answer_adapter.dart';

class BasicQuestionWithAnswerAdapter {
  static BasicQuestionWithAnswer fromResponse(
      BasicQuestionWithAnswerResponse res) {
    return BasicQuestionWithAnswer(
      id: res.id,
      categoryId: res.categoryId,
      question: res.question,
      description: res.description,
      options: res.options,
      createdAt: res.createdAt, // 또는 DateTime.parse(res.createdAt) (타입에 따라)
      updatedAt: res.updatedAt, // 또는 DateTime.parse(res.updatedAt)
      answer: res.answer != null
          ? BasicAnswerAdapter.fromResponse(res.answer!)
          : null,
    );
  }
}
