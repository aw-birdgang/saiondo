import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/basic_answer.dart';
import '../../../domain/entry/basic_question.dart';
import '../../../domain/entry/basic_question_with_answer.dart';
import '../constants/endpoints.dart';
import '../dto/basic_answer_request.dart';
import '../rest_client.dart';

class BasicQuestionWithAnswerApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  BasicQuestionWithAnswerApi(this._dioClient, this._restClient);

  Future<List<BasicQuestion>> fetchQuestions() async {
    final res = await _dioClient.dio.get('${Endpoints.baseUrl}/basic-questions');
    return (res.data as List)
        .map((e) => BasicQuestion.fromJson(e))
        .toList();
  }

  Future<void> submitAnswer(BasicAnswerRequest req) async {
    await _dioClient.dio.post('${Endpoints.baseUrl}/basic-answers', data: req.toJson());
  }

  Future<List<BasicAnswer>> fetchAnswersByUser(String userId) async {
    final res = await _dioClient.dio.get('${Endpoints.baseUrl}/basic-answers/user/$userId');
    return (res.data as List)
        .map((e) => BasicAnswer.fromJson(e))
        .toList();
  }

  Future<List<BasicQuestionWithAnswer>> fetchQuestionsWithAnswers(String userId) async {
    final res = await _dioClient.dio.get('${Endpoints.baseUrl}/basic-question-with-answer/questions-with-answers', queryParameters: {'userId': userId});
    return (res.data as List)
        .map((e) => BasicQuestionWithAnswer.fromJson(e))
        .toList();
  }

}
