import '../../domain/entry/basic_question_category.dart';
import '../network/dto/basic_question_category_response.dart';

class BasicQuestionCategoryAdapter {
  static BasicQuestionCategory fromResponse(
          BasicQuestionCategoryResponse res) =>
      BasicQuestionCategory(
        id: res.id,
        code: res.code,
        name: res.name,
      );
}
