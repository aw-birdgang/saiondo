import '../../domain/entry/advice.dart';
import '../../domain/repository/advice_repository.dart';
import '../adapter/advice_adapter.dart';
import '../network/apis/advice_api.dart';

class AdviceRepositoryImpl implements AdviceRepository {
  final AdviceApi _api;
  AdviceRepositoryImpl(this._api);

  @override
  Future<List<Advice>> fetchAdviceHistory(String channelId) async {
    final responseList = await _api.fetchAdviceHistory(channelId);
    return responseList.map((res) => AdviceAdapter.fromResponse(res)).toList();
  }
}