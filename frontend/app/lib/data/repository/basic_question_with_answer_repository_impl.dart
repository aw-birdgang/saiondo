import 'package:saiondo/domain/entry/basic_question_category.dart';
import 'package:saiondo/domain/entry/basic_question_with_answer.dart';

import '../../domain/entry/basic_answer.dart';
import '../../domain/entry/basic_question.dart';
import '../../domain/repository/basic_question_with_answer_repository.dart';
import '../adapter/basic_question_category_adapter.dart';
import '../adapter/basic_question_with_answer_adapter.dart';
import '../network/apis/basic_question_with_answer_api.dart';

class BasicQuestionWithAnswerRepositoryImpl
    implements BasicQuestionWithAnswerRepository {
  final BasicQuestionWithAnswerApi _api;

  BasicQuestionWithAnswerRepositoryImpl(this._api);

  @override
  Future<List<BasicQuestionCategory>> fetchCategories() async {
    final res = await _api.fetchCategories();
    return res.map(BasicQuestionCategoryAdapter.fromResponse).toList();
  }

  @override
  Future<List<BasicQuestion>> fetchQuestions() async {
    return await _api.fetchQuestions();
  }

  @override
  Future<List<BasicQuestionWithAnswer>> fetchQuestionsWithAnswersOnCategory(
      String userId, String categoryId) async {
    final res = await _api.fetchQuestionsWithAnswers(userId, categoryId);
    return res.map(BasicQuestionWithAnswerAdapter.fromResponse).toList();
  }

  @override
  Future<List<BasicQuestionWithAnswer>> fetchCategoryQAndAByUserId(
      String userId, String categoryId) async {
    final res = await _api.fetchCategoryQAndAByUserId(userId, categoryId);
    return res.map(BasicQuestionWithAnswerAdapter.fromResponse).toList();
  }

  @override
  Future<List<BasicAnswer>> fetchAnswersByUser(String userId) async {
    return await _api.fetchAnswersByUser(userId);
  }

  @override
  Future<BasicAnswer> submitOrUpdateAnswer({
    required String userId,
    required String questionId,
    required String answer,
    String? answerId,
  }) async {
    return await _api.submitOrUpdateAnswer(
      userId: userId,
      questionId: questionId,
      answer: answer,
      answerId: answerId,
    );
  }
}
