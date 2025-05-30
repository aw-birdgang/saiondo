// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'basic_question_answer_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$BasicQuestionAnswerStore on _BasicQuestionAnswerStore, Store {
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

  late final _$isLoadingAtom =
      Atom(name: '_BasicQuestionAnswerStore.isLoading', context: context);

  @override
  bool get isLoading {
    _$isLoadingAtom.reportRead();
    return super.isLoading;
  }

  @override
  set isLoading(bool value) {
    _$isLoadingAtom.reportWrite(value, super.isLoading, () {
      super.isLoading = value;
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

  late final _$loadQuestionsWithAnswersAsyncAction = AsyncAction(
      '_BasicQuestionAnswerStore.loadQuestionsWithAnswers',
      context: context);

  @override
  Future<void> loadQuestionsWithAnswers() {
    return _$loadQuestionsWithAnswersAsyncAction
        .run(() => super.loadQuestionsWithAnswers());
  }

  late final _$submitAnswersAsyncAction =
      AsyncAction('_BasicQuestionAnswerStore.submitAnswers', context: context);

  @override
  Future<void> submitAnswers() {
    return _$submitAnswersAsyncAction.run(() => super.submitAnswers());
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
questions: ${questions},
answers: ${answers},
isLoading: ${isLoading},
isSubmitting: ${isSubmitting}
    ''';
  }
}
