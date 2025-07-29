import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/basic_answer.dart';
import '../../../domain/entry/basic_question.dart';
import '../constants/endpoints.dart';
import '../dto/basic_answer_request.dart';
import '../dto/basic_question_category_response.dart';
import '../dto/basic_question_response.dart';
import '../dto/basic_question_with_answer_response.dart';

class BasicQuestionWithAnswerApi {
  final DioClient _dioClient;

  BasicQuestionWithAnswerApi(this._dioClient);

  Future<List<BasicQuestion>> fetchQuestions() async {
    final res =
        await _dioClient.dio.get('${Endpoints.baseUrl}/basic-questions');
    return (res.data as List).map((e) => BasicQuestion.fromJson(e)).toList();
  }

  Future<void> submitAnswer(BasicAnswerRequest req) async {
    await _dioClient.dio
        .post('${Endpoints.baseUrl}/basic-answers', data: req.toJson());
  }

  Future<List<BasicAnswer>> fetchAnswersByUser(String userId) async {
    final res = await _dioClient.dio
        .get('${Endpoints.baseUrl}/basic-answers/user/$userId');
    return (res.data as List).map((e) => BasicAnswer.fromJson(e)).toList();
  }

  Future<List<BasicQuestionWithAnswerResponse>> fetchQuestionsWithAnswers(
      String userId, String categoryId) async {
    final res = await _dioClient.dio.get(
      '${Endpoints.baseUrl}/basic-question-with-answer/questions-with-answers',
      queryParameters: {'userId': userId, 'categoryId': categoryId},
    );
    return (res.data as List)
        .map((e) => BasicQuestionWithAnswerResponse.fromJson(e))
        .toList();
  }

  Future<List<BasicQuestionWithAnswerResponse>> fetchCategoryQAndAByUserId(
      String userId, String categoryId) async {
    print(
        '[fetchCategoryQAndAByUserId] userId: $userId, categoryId: $categoryId');

    final res = await _dioClient.dio.get(
      '${Endpoints.baseUrl}/basic-question-with-answer/categories/$categoryId/questions-with-answers',
      queryParameters: {'userId': userId},
    );
    return (res.data as List)
        .map((e) => BasicQuestionWithAnswerResponse.fromJson(e))
        .toList();
  }

  Future<BasicAnswer> submitOrUpdateAnswer({
    required String userId,
    required String questionId,
    required String answer,
    String? answerId, // 있으면 수정, 없으면 생성
  }) async {
    final data = {
      'userId': userId,
      'questionId': questionId,
      'answer': answer,
    };
    if (answerId != null && answerId.isNotEmpty) {
      data['id'] = answerId;
    }
    final res = await _dioClient.dio.post(
      '${Endpoints.baseUrl}/basic-question-with-answer/answer',
      data: data,
    );
    return BasicAnswer.fromJson(res.data);
  }

  Future<List<BasicQuestionCategoryResponse>> fetchCategories() async {
    final res =
        await _dioClient.dio.get('/basic-question-with-answer/categories');
    return (res.data as List)
        .map((e) => BasicQuestionCategoryResponse.fromJson(e))
        .toList();
  }

  Future<List<BasicQuestionResponse>> fetchQuestionsByCategory(
      String categoryId) async {
    final res = await _dioClient.dio
        .get('/basic-question-with-answer/categories/$categoryId/questions');
    return (res.data as List)
        .map((e) => BasicQuestionResponse.fromJson(e))
        .toList();
  }
}
