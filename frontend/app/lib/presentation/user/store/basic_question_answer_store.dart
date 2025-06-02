import 'package:app/presentation/user/store/user_store.dart';
import 'package:mobx/mobx.dart';

import '../../../domain/entry/basic_question_category.dart';
import '../../../domain/entry/basic_question_with_answer.dart';
import '../../../domain/repository/basic_question_with_answer_repository.dart';
import '../../../domain/repository/point_repository.dart';

part 'basic_question_answer_store.g.dart';

class BasicQuestionAnswerStore = _BasicQuestionAnswerStore with _$BasicQuestionAnswerStore;

abstract class _BasicQuestionAnswerStore with Store {
  final PointRepository _pointRepository;
  final BasicQuestionWithAnswerRepository _repository;
  final UserStore _userStore;

  _BasicQuestionAnswerStore(
    this._pointRepository,
    this._repository,
    this._userStore,
  );

  @observable
  ObservableList<BasicQuestionCategory> categories = ObservableList<BasicQuestionCategory>();

  @observable
  String? selectedCategoryId;

  @observable
  ObservableList<BasicQuestionWithAnswer> questions = ObservableList<BasicQuestionWithAnswer>();

  @observable
  ObservableMap<String, String> answers = ObservableMap<String, String>();

  @observable
  bool isLoadingCategories = false;

  @observable
  bool isLoadingQuestions = false;

  @observable
  bool isSubmitting = false;

  @observable
  String? errorMessage;

  // 카테고리별 질문/답변 리스트
  @observable
  ObservableMap<String, List<BasicQuestionWithAnswer>> categoryQuestionsMap = ObservableMap.of({});

  String? get userId => _userStore.selectedUser?.id;

  @computed
  int get totalQuestions => questions.length;

  @computed
  int get answeredCount =>
      questions.where((q) => (answers[q.id]?.trim().isNotEmpty ?? false)).length;

  @computed
  double get answerRatio =>
      totalQuestions == 0 ? 0 : answeredCount / totalQuestions;

  /// 카테고리별 진도율 계산용 헬퍼
  _CategoryProgress getCategoryProgress(String categoryId) {
    final questions = categoryQuestionsMap[categoryId] ?? [];
    final total = questions.length;
    final answered = questions.where((q) => q.answer != null && q.answer!.answer.trim().isNotEmpty).length;
    final ratio = total == 0 ? 0.0 : answered / total;
    return _CategoryProgress(total: total, answered: answered, ratio: ratio);
  }

  @action
  Future<void> loadCategories() async {
    isLoadingCategories = true;
    errorMessage = null;
    try {
      final result = await _repository.fetchCategories();
      categories = ObservableList.of(result);
      if (categories.isNotEmpty) {
        selectedCategoryId ??= categories.first.id;
        // 카테고리 로드 후 모든 카테고리별 질문+답변도 로드
        await loadAllCategoryQAndAByUserId();
      }
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isLoadingCategories = false;
    }
  }

  @action
  Future<void> fetchCategoryQAndAByUserId() async {
    isLoadingQuestions = true;
    errorMessage = null;
    try {
      final uid = userId;
      final catId = selectedCategoryId;

      print('[fetchCategoryQAndAByUserId] uid: $uid, catId: $catId');
      if (uid == null || catId == null) throw Exception('로그인 또는 카테고리 정보가 없습니다.');
      final result = await _repository.fetchCategoryQAndAByUserId(uid, catId);

      // === result 로그 출력 ===
      print('[fetchCategoryQAndAByUserId] result: $result');

      questions = ObservableList.of(result);
      answers.clear();
      for (final q in result) {
        if (q.answer != null && q.answer!.answer != null) {
          answers[q.id] = q.answer!.answer!;
        }
      }
    } catch (e) {
      errorMessage = e.toString();
      questions.clear();
      answers.clear();
    } finally {
      isLoadingQuestions = false;
    }
  }

  @action
  Future<void> selectCategory(String categoryId) async {
    selectedCategoryId = categoryId;
    await fetchCategoryQAndAByUserId();
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
    await fetchCategoryQAndAByUserId();
    // 전체 카테고리별 질문/답변도 갱신
    await loadAllCategoryQAndAByUserId();
  }

  @action
  void setAnswer(String questionId, String answer) {
    answers[questionId] = answer;
  }

  @action
  Future<void> submitAnswers() async {
    isSubmitting = true;
    errorMessage = null;
    try {
      for (final q in questions) {
        final answer = answers[q.id];
        if (answer != null && answer.trim().isNotEmpty) {
          await submitSingleAnswer(q.id, answer.trim());
        }
      }
    } catch (e) {
      errorMessage = e.toString();
    } finally {
      isSubmitting = false;
    }
  }

  @action
  Future<void> loadAllCategoryQAndAByUserId() async {
    isLoadingQuestions = true;
    errorMessage = null;
    try {
      final uid = userId;
      if (uid == null) throw Exception('로그인 정보가 없습니다.');
      for (final cat in categories) {
        final result = await _repository.fetchCategoryQAndAByUserId(uid, cat.id);
        categoryQuestionsMap[cat.id] = result;
        // answers 맵도 전체 카테고리 기준으로 갱신
        for (final q in result) {
          if (q.answer != null && q.answer!.answer != null) {
            answers[q.id] = q.answer!.answer!;
          }
        }
      }
    } catch (e) {
      errorMessage = e.toString();
      categoryQuestionsMap.clear();
    } finally {
      isLoadingQuestions = false;
    }
  }
}

// 카테고리별 진도율 계산용 클래스
class _CategoryProgress {
  final int total;
  final int answered;
  final double ratio;
  _CategoryProgress({required this.total, required this.answered, required this.ratio});
}