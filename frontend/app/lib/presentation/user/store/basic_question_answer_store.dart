import 'package:app/presentation/user/store/user_store.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/entry/basic_answer.dart';
import '../../../domain/entry/basic_question_with_answer.dart';
import '../../../domain/repository/basic_question_with_answer_repository.dart';
import '../../../domain/repository/point_repository.dart';

part 'basic_question_answer_store.g.dart';

class BasicQuestionAnswerStore = _BasicQuestionAnswerStore with _$BasicQuestionAnswerStore;

abstract class _BasicQuestionAnswerStore with Store {
  final PointRepository _pointRepository;
  final BasicQuestionWithAnswerRepository _repository;
  final UserStore _userStore; // UserStore 주입

  _BasicQuestionAnswerStore(
    this._pointRepository,
    this._repository,
    this._userStore,
  );

  @observable
  ObservableList<BasicQuestionWithAnswer> questions = ObservableList<BasicQuestionWithAnswer>();

  @observable
  ObservableMap<String, String> answers = ObservableMap<String, String>();

  @observable
  bool isLoading = false;

  @observable
  bool isSubmitting = false;

  String? get userId => _userStore.selectedUser?.id;

  @computed
  int get totalQuestions => questions.length;

  @computed
  int get answeredCount =>
      questions.where((q) => (answers[q.id]?.trim().isNotEmpty ?? false)).length;

  @computed
  double get answerRatio =>
      totalQuestions == 0 ? 0 : answeredCount / totalQuestions;

  @action
  Future<void> loadQuestionsWithAnswers() async {
    isLoading = true;
    try {
      final uid = userId;
      if (uid == null) throw Exception('로그인 정보가 없습니다.');
      final result = await _repository.fetchQuestionsWithAnswers(uid);
      questions = ObservableList.of(result);
      answers.clear();
      for (final q in result) {
        if (q.answer != null) {
          answers[q.id] = q.answer!.answer;
        }
      }
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> submitSingleAnswer(String questionId, String answer) async {
    final uid = userId;
    if (uid == null) throw Exception('로그인 정보가 없습니다.');
    final q = questions.firstWhere((e) => e.id == questionId);
    final answerId = q.answer?.id;
    final saved = await _repository.submitOrUpdateAnswer(
      userId: uid,
      questionId: questionId,
      answer: answer,
      answerId: answerId,
    );
    answers[questionId] = saved.answer;
    // 질문 리스트도 갱신
    await loadQuestionsWithAnswers();
  }

  @action
  void setAnswer(String questionId, String answer) {
    answers[questionId] = answer;
  }

  @action
  Future<void> submitAnswers() async {
    isSubmitting = true;
    try {
      for (final q in questions) {
        final answer = answers[q.id];
        if (answer != null && answer.trim().isNotEmpty) {
          await submitSingleAnswer(q.id, answer.trim());
        }
      }
    } finally {
      isSubmitting = false;
    }
  }
}