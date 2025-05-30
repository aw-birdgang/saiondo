import 'package:app/domain/entry/basic_question_with_answer.dart';

import '../../domain/entry/basic_answer.dart';
import '../../domain/entry/basic_question.dart';
import '../../domain/repository/basic_question_with_answer_repository.dart';
import '../network/apis/basic_question_with_answer_api.dart';
import '../network/dto/basic_answer_request.dart';

class BasicQuestionWithAnswerRepositoryImpl implements BasicQuestionWithAnswerRepository {
  final BasicQuestionWithAnswerApi _api;

  BasicQuestionWithAnswerRepositoryImpl(this._api);

  @override
  Future<List<BasicQuestion>> fetchQuestions() async {
    final res = await _api.fetchQuestions();
    return res;
  }

  @override
  Future<List<BasicQuestionWithAnswer>> fetchQuestionsWithAnswers(String userId) =>
      _api.fetchQuestionsWithAnswers(userId);

  @override
  Future<void> submitAnswer(BasicAnswer answer) async {
    final req = BasicAnswerRequest(
      userId: answer.userId,
      questionId: answer.questionId,
      answer: answer.answer,
    );
    await _api.submitAnswer(req);
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
  }) =>
      _api.submitOrUpdateAnswer(
        userId: userId,
        questionId: questionId,
        answer: answer,
        answerId: answerId,
      );
}
