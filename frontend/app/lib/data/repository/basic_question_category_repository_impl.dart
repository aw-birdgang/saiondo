import '../../domain/entry/basic_question_category.dart';
import '../../domain/repository/basic_question_category_repository.dart';
import '../adapter/basic_question_category_adapter.dart';
import '../network/apis/basic_question_with_answer_api.dart';

class BasicQuestionCategoryRepositoryImpl
    implements BasicQuestionCategoryRepository {
  final BasicQuestionWithAnswerApi _api;
  BasicQuestionCategoryRepositoryImpl(this._api);

  @override
  Future<List<BasicQuestionCategory>> fetchCategories() async {
    final res = await _api.fetchCategories();
    return res.map(BasicQuestionCategoryAdapter.fromResponse).toList();
  }
}
