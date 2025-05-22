import '../../../core/data/network/dio/dio_client.dart';
import '../../../domain/entry/category_code.dart';
import '../constants/endpoints.dart';
import '../rest_client.dart';

class CategoryCodeApi {
  final DioClient _dioClient;
  final RestClient _restClient;

  CategoryCodeApi(this._dioClient, this._restClient);

  Future<List<CategoryCode>> fetchCategoryCodes() async {
    final response = await _dioClient.dio.get(Endpoints.getCategoryCodes);
    return (response.data as List).map((e) => CategoryCode.fromJson(e)).toList();
  }
}