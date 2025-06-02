import '../entry/basic_question_category.dart';

abstract class BasicQuestionCategoryRepository {
  Future<List<BasicQuestionCategory>> fetchCategories();
}
