import '../../domain/entry/basic_question.dart';
import '../../domain/repository/basic_question_repository.dart';
import '../adapter/basic_question_adapter.dart';
import '../network/apis/basic_question_with_answer_api.dart';

class BasicQuestionRepositoryImpl implements BasicQuestionRepository {
  final BasicQuestionWithAnswerApi _api;
  BasicQuestionRepositoryImpl(this._api);

  @override
  Future<List<BasicQuestion>> fetchQuestionsByCategory(
      String categoryId) async {
    final res = await _api.fetchQuestionsByCategory(categoryId);
    return res.map(BasicQuestionAdapter.fromResponse).toList();
  }
}
