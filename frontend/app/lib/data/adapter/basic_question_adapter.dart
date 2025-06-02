import '../../domain/entry/basic_question.dart';
import '../network/dto/basic_question_response.dart';

class BasicQuestionAdapter {
  static BasicQuestion fromResponse(BasicQuestionResponse res) =>
      BasicQuestion(
        id: res.id,
        question: res.question,
        description: res.description,
        categoryId: res.categoryId,
      );
}