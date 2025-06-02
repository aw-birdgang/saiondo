import '../entry/basic_question.dart';

abstract class BasicQuestionRepository {
  Future<List<BasicQuestion>> fetchQuestionsByCategory(String categoryId);
}
