import '../../../data/network/apis/category_code_api.dart';
import '../../entry/category_code.dart';

class FetchCategoryCodesUseCase {
  final CategoryCodeApi api;
  FetchCategoryCodesUseCase(this.api);

  Future<List<CategoryCode>> call() async {
    return await api.fetchCategoryCodes();
  }
}