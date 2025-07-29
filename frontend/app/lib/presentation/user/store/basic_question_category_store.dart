import 'package:mobx/mobx.dart';
import '../../../domain/entry/basic_question_category.dart';
import '../../../domain/entry/basic_question.dart';
import '../../../domain/repository/basic_question_category_repository.dart';
import '../../../domain/repository/basic_question_repository.dart';

part 'basic_question_category_store.g.dart';

class BasicQuestionCategoryStore = _BasicQuestionCategoryStore
    with _$BasicQuestionCategoryStore;

abstract class _BasicQuestionCategoryStore with Store {
  final BasicQuestionCategoryRepository _categoryRepository;
  final BasicQuestionRepository _questionRepository;

  _BasicQuestionCategoryStore(
      this._categoryRepository, this._questionRepository);

  @observable
  ObservableList<BasicQuestionCategory> categories = ObservableList();

  @observable
  ObservableMap<String, List<BasicQuestion>> questionsByCategory =
      ObservableMap();

  @observable
  String? selectedCategoryId;

  @observable
  bool isLoading = false;

  @action
  Future<void> loadCategories() async {
    isLoading = true;
    try {
      final result = await _categoryRepository.fetchCategories();
      categories = ObservableList.of(result);
    } finally {
      isLoading = false;
    }
  }

  @action
  Future<void> loadQuestionsForCategory(String categoryId) async {
    isLoading = true;
    try {
      final result =
          await _questionRepository.fetchQuestionsByCategory(categoryId);
      questionsByCategory[categoryId] = result;
      selectedCategoryId = categoryId;
    } finally {
      isLoading = false;
    }
  }
}
