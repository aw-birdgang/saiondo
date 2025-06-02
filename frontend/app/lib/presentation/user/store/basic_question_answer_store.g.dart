// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'basic_question_answer_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$BasicQuestionAnswerStore on _BasicQuestionAnswerStore, Store {
  Computed<int>? _$totalQuestionsComputed;

  @override
  int get totalQuestions =>
      (_$totalQuestionsComputed ??= Computed<int>(() => super.totalQuestions,
              name: '_BasicQuestionAnswerStore.totalQuestions'))
          .value;
  Computed<int>? _$answeredCountComputed;

  @override
  int get answeredCount =>
      (_$answeredCountComputed ??= Computed<int>(() => super.answeredCount,
              name: '_BasicQuestionAnswerStore.answeredCount'))
          .value;
  Computed<double>? _$answerRatioComputed;

  @override
  double get answerRatio =>
      (_$answerRatioComputed ??= Computed<double>(() => super.answerRatio,
              name: '_BasicQuestionAnswerStore.answerRatio'))
          .value;

  late final _$categoriesAtom =
      Atom(name: '_BasicQuestionAnswerStore.categories', context: context);

  @override
  ObservableList<BasicQuestionCategory> get categories {
    _$categoriesAtom.reportRead();
    return super.categories;
  }

  @override
  set categories(ObservableList<BasicQuestionCategory> value) {
    _$categoriesAtom.reportWrite(value, super.categories, () {
      super.categories = value;
    });
  }

  late final _$selectedCategoryIdAtom = Atom(
      name: '_BasicQuestionAnswerStore.selectedCategoryId', context: context);

  @override
  String? get selectedCategoryId {
    _$selectedCategoryIdAtom.reportRead();
    return super.selectedCategoryId;
  }

  @override
  set selectedCategoryId(String? value) {
    _$selectedCategoryIdAtom.reportWrite(value, super.selectedCategoryId, () {
      super.selectedCategoryId = value;
    });
  }

  late final _$questionsAtom =
      Atom(name: '_BasicQuestionAnswerStore.questions', context: context);

  @override
  ObservableList<BasicQuestionWithAnswer> get questions {
    _$questionsAtom.reportRead();
    return super.questions;
  }

  @override
  set questions(ObservableList<BasicQuestionWithAnswer> value) {
    _$questionsAtom.reportWrite(value, super.questions, () {
      super.questions = value;
    });
  }

  late final _$answersAtom =
      Atom(name: '_BasicQuestionAnswerStore.answers', context: context);

  @override
  ObservableMap<String, String> get answers {
    _$answersAtom.reportRead();
    return super.answers;
  }

  @override
  set answers(ObservableMap<String, String> value) {
    _$answersAtom.reportWrite(value, super.answers, () {
      super.answers = value;
    });
  }

  late final _$isLoadingCategoriesAtom = Atom(
      name: '_BasicQuestionAnswerStore.isLoadingCategories', context: context);

  @override
  bool get isLoadingCategories {
    _$isLoadingCategoriesAtom.reportRead();
    return super.isLoadingCategories;
  }

  @override
  set isLoadingCategories(bool value) {
    _$isLoadingCategoriesAtom.reportWrite(value, super.isLoadingCategories, () {
      super.isLoadingCategories = value;
    });
  }

  late final _$isLoadingQuestionsAtom = Atom(
      name: '_BasicQuestionAnswerStore.isLoadingQuestions', context: context);

  @override
  bool get isLoadingQuestions {
    _$isLoadingQuestionsAtom.reportRead();
    return super.isLoadingQuestions;
  }

  @override
  set isLoadingQuestions(bool value) {
    _$isLoadingQuestionsAtom.reportWrite(value, super.isLoadingQuestions, () {
      super.isLoadingQuestions = value;
    });
  }

  late final _$isSubmittingAtom =
      Atom(name: '_BasicQuestionAnswerStore.isSubmitting', context: context);

  @override
  bool get isSubmitting {
    _$isSubmittingAtom.reportRead();
    return super.isSubmitting;
  }

  @override
  set isSubmitting(bool value) {
    _$isSubmittingAtom.reportWrite(value, super.isSubmitting, () {
      super.isSubmitting = value;
    });
  }

  late final _$errorMessageAtom =
      Atom(name: '_BasicQuestionAnswerStore.errorMessage', context: context);

  @override
  String? get errorMessage {
    _$errorMessageAtom.reportRead();
    return super.errorMessage;
  }

  @override
  set errorMessage(String? value) {
    _$errorMessageAtom.reportWrite(value, super.errorMessage, () {
      super.errorMessage = value;
    });
  }

  late final _$categoryQuestionsMapAtom = Atom(
      name: '_BasicQuestionAnswerStore.categoryQuestionsMap', context: context);

  @override
  ObservableMap<String, List<BasicQuestionWithAnswer>>
      get categoryQuestionsMap {
    _$categoryQuestionsMapAtom.reportRead();
    return super.categoryQuestionsMap;
  }

  @override
  set categoryQuestionsMap(
      ObservableMap<String, List<BasicQuestionWithAnswer>> value) {
    _$categoryQuestionsMapAtom.reportWrite(value, super.categoryQuestionsMap,
        () {
      super.categoryQuestionsMap = value;
    });
  }

  late final _$loadCategoriesAsyncAction =
      AsyncAction('_BasicQuestionAnswerStore.loadCategories', context: context);

  @override
  Future<void> loadCategories() {
    return _$loadCategoriesAsyncAction.run(() => super.loadCategories());
  }

  late final _$fetchCategoryQAndAByUserIdAsyncAction = AsyncAction(
      '_BasicQuestionAnswerStore.fetchCategoryQAndAByUserId',
      context: context);

  @override
  Future<void> fetchCategoryQAndAByUserId({bool forceRefresh = false}) {
    return _$fetchCategoryQAndAByUserIdAsyncAction.run(
        () => super.fetchCategoryQAndAByUserId(forceRefresh: forceRefresh));
  }

  late final _$selectCategoryAsyncAction =
      AsyncAction('_BasicQuestionAnswerStore.selectCategory', context: context);

  @override
  Future<void> selectCategory(String categoryId) {
    return _$selectCategoryAsyncAction
        .run(() => super.selectCategory(categoryId));
  }

  late final _$submitSingleAnswerAsyncAction = AsyncAction(
      '_BasicQuestionAnswerStore.submitSingleAnswer',
      context: context);

  @override
  Future<void> submitSingleAnswer(String questionId, String answer) {
    return _$submitSingleAnswerAsyncAction
        .run(() => super.submitSingleAnswer(questionId, answer));
  }

  late final _$submitAnswersAsyncAction =
      AsyncAction('_BasicQuestionAnswerStore.submitAnswers', context: context);

  @override
  Future<void> submitAnswers() {
    return _$submitAnswersAsyncAction.run(() => super.submitAnswers());
  }

  late final _$loadAllCategoryQAndAByUserIdAsyncAction = AsyncAction(
      '_BasicQuestionAnswerStore.loadAllCategoryQAndAByUserId',
      context: context);

  @override
  Future<void> loadAllCategoryQAndAByUserId({bool forceRefresh = false}) {
    return _$loadAllCategoryQAndAByUserIdAsyncAction.run(
        () => super.loadAllCategoryQAndAByUserId(forceRefresh: forceRefresh));
  }

  late final _$_BasicQuestionAnswerStoreActionController =
      ActionController(name: '_BasicQuestionAnswerStore', context: context);

  @override
  void setAnswer(String questionId, String answer) {
    final _$actionInfo = _$_BasicQuestionAnswerStoreActionController
        .startAction(name: '_BasicQuestionAnswerStore.setAnswer');
    try {
      return super.setAnswer(questionId, answer);
    } finally {
      _$_BasicQuestionAnswerStoreActionController.endAction(_$actionInfo);
    }
  }

  @override
  String toString() {
    return '''
categories: ${categories},
selectedCategoryId: ${selectedCategoryId},
questions: ${questions},
answers: ${answers},
isLoadingCategories: ${isLoadingCategories},
isLoadingQuestions: ${isLoadingQuestions},
isSubmitting: ${isSubmitting},
errorMessage: ${errorMessage},
categoryQuestionsMap: ${categoryQuestionsMap},
totalQuestions: ${totalQuestions},
answeredCount: ${answeredCount},
answerRatio: ${answerRatio}
    ''';
  }
}
