import '../entry/basic_answer.dart';
import '../entry/basic_question.dart';
import '../entry/basic_question_category.dart';
import '../entry/basic_question_with_answer.dart';

abstract class BasicQuestionWithAnswerRepository {
  Future<List<BasicQuestionCategory>> fetchCategories();
  Future<List<BasicQuestion>> fetchQuestions();
  Future<List<BasicQuestionWithAnswer>> fetchQuestionsWithAnswersOnCategory(String userId, String categoryId);
  Future<List<BasicQuestionWithAnswer>> fetchCategoryQAndAByUserId(String userId, String categoryId);
  Future<BasicAnswer> submitOrUpdateAnswer({
    required String userId,
    required String questionId,
    required String answer,
    String? answerId,
  });
  Future<List<BasicAnswer>> fetchAnswersByUser(String userId);
}