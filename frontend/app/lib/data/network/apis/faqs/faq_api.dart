import 'dart:async';

import '../../../../core/data/network/dio/dio_client.dart';
import '../../../../domain/entry/faq/faq_list.dart';
import '../../constants/endpoints.dart';
import '../../rest_client.dart';

class FaqApi {

  // dio instance
  final DioClient _dioClient;

  // rest-client instance
  final RestClient _restClient;

  // injecting dio instance
  FaqApi(this._dioClient, this._restClient);

  Future<FaqList> getFaqs() async {
    try {
      final res = await _dioClient.dio.get(Endpoints.getFaqs);
      return FaqList.fromJson(res.data);
    } catch (e) {
      print(e.toString());
      throw e;
    }
  }

}