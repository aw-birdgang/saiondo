import '../entry/basic_answer.dart';
import '../entry/basic_question.dart';
import '../entry/basic_question_with_answer.dart';

abstract class BasicQuestionWithAnswerRepository {
  Future<List<BasicQuestion>> fetchQuestions();
  Future<List<BasicQuestionWithAnswer>> fetchQuestionsWithAnswers(String userId);
  Future<BasicAnswer> submitOrUpdateAnswer({
    required String userId,
    required String questionId,
    required String answer,
    String? answerId,
  });
  Future<List<BasicAnswer>> fetchAnswersByUser(String userId);
}