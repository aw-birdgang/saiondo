import 'package:mobx/mobx.dart';

import '../../../domain/entry/user/category_code.dart';
import '../../../domain/usecase/category/fetch_category_codes_usecase.dart';

part 'category_code_store.g.dart';

class CategoryCodeStore = _CategoryCodeStore with _$CategoryCodeStore;

abstract class _CategoryCodeStore with Store {
  final FetchCategoryCodesUseCase fetchCategoryCodesUseCase;
  _CategoryCodeStore(this.fetchCategoryCodesUseCase) {
    loadCodes();
  }

  @observable
  ObservableList<CategoryCode> codes = ObservableList();

  @observable
  bool isLoading = false;

  @observable
  String? error;

  @action
  Future<void> loadCodes() async {
    isLoading = true;
    error = null;
    try {
      final result = await fetchCategoryCodesUseCase();
      codes = ObservableList.of(result);
    } catch (e) {
      error = e.toString();
    } finally {
      isLoading = false;
    }
  }
}