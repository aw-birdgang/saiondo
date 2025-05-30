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
  final BasicQuestionWithAnswerRepository _baseQuestionWithAnswerRepository;
  final UserStore _userStore; // UserStore 주입

  _BasicQuestionAnswerStore(
    this._pointRepository,
    this._baseQuestionWithAnswerRepository,
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

  @action
  Future<void> loadQuestionsWithAnswers() async {
    isLoading = true;
    try {
      final userId = _userStore.selectedUser?.id;
      if (userId == null) throw Exception('로그인 정보가 없습니다.');
      final result = await _baseQuestionWithAnswerRepository.fetchQuestionsWithAnswers(userId);
      questions = ObservableList.of(result);
      // 기존 답변을 answers 맵에 미리 채워넣기
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
  void setAnswer(String questionId, String answer) {
    answers[questionId] = answer;
  }

  @action
  Future<void> submitAnswers() async {
    isSubmitting = true;
    try {
      final uid = userId;
      if (uid == null) {
        // 유저 정보가 없으면 예외 처리
        throw Exception('로그인 정보가 없습니다.');
      }
      for (final q in questions) {
        final answer = answers[q.id];
        if (answer != null && answer.trim().isNotEmpty) {
          await _baseQuestionWithAnswerRepository.submitAnswer(
            BasicAnswer(
              id: '', // 서버에서 생성
              userId: uid,
              questionId: q.id,
              answer: answer.trim(),
              createdAt: DateTime.now(),
              updatedAt: DateTime.now(),
            ),
          );
          // 포인트 지급 예시
          // await _pointRepository.earnPoint(uid, 10, 'PROFILE_UPDATE', description: '기본질문 답변: ${q.question}');
        }
      }
    } finally {
      isSubmitting = false;
    }
  }
}