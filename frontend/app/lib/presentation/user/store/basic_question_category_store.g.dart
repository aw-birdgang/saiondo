// GENERATED CODE - DO NOT MODIFY BY HAND

part of 'basic_question_category_store.dart';

// **************************************************************************
// StoreGenerator
// **************************************************************************

// ignore_for_file: non_constant_identifier_names, unnecessary_brace_in_string_interps, unnecessary_lambdas, prefer_expression_function_bodies, lines_longer_than_80_chars, avoid_as, avoid_annotating_with_dynamic, no_leading_underscores_for_local_identifiers

mixin _$BasicQuestionCategoryStore on _BasicQuestionCategoryStore, Store {
  late final _$categoriesAtom =
      Atom(name: '_BasicQuestionCategoryStore.categories', context: context);

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

  late final _$questionsByCategoryAtom = Atom(
      name: '_BasicQuestionCategoryStore.questionsByCategory',
      context: context);

  @override
  ObservableMap<String, List<BasicQuestion>> get questionsByCategory {
    _$questionsByCategoryAtom.reportRead();
    return super.questionsByCategory;
  }

  @override
  set questionsByCategory(ObservableMap<String, List<BasicQuestion>> value) {
    _$questionsByCategoryAtom.reportWrite(value, super.questionsByCategory, () {
      super.questionsByCategory = value;
    });
  }

  late final _$selectedCategoryIdAtom = Atom(
      name: '_BasicQuestionCategoryStore.selectedCategoryId', context: context);

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

  late final _$isLoadingAtom =
      Atom(name: '_BasicQuestionCategoryStore.isLoading', context: context);

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

  late final _$loadCategoriesAsyncAction = AsyncAction(
      '_BasicQuestionCategoryStore.loadCategories',
      context: context);

  @override
  Future<void> loadCategories() {
    return _$loadCategoriesAsyncAction.run(() => super.loadCategories());
  }

  late final _$loadQuestionsForCategoryAsyncAction = AsyncAction(
      '_BasicQuestionCategoryStore.loadQuestionsForCategory',
      context: context);

  @override
  Future<void> loadQuestionsForCategory(String categoryId) {
    return _$loadQuestionsForCategoryAsyncAction
        .run(() => super.loadQuestionsForCategory(categoryId));
  }

  @override
  String toString() {
    return '''
categories: ${categories},
questionsByCategory: ${questionsByCategory},
selectedCategoryId: ${selectedCategoryId},
isLoading: ${isLoading}
    ''';
  }
}
