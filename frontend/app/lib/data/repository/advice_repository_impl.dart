import '../../domain/entry/advice.dart';
import '../../domain/repository/advice_repository.dart';
import '../network/apis/advice_api.dart';

class AdviceRepositoryImpl implements AdviceRepository {
  final AdviceApi _api;
  AdviceRepositoryImpl(this._api);

  Future<List<Advice>> fetchAdvices(String channelId) async {
    final responseList = await _api.fetchAdvices(channelId);
    return responseList.map((res) => Advice(
      id: res.id,
      channelId: res.channelId,
      advice: res.advice,
      createdAt: DateTime.parse(res.createdAt),
    )).toList();
  }
}