import '../../domain/entry/advice.dart';
import '../network/dto/advice_response.dart';

class AdviceAdapter {
  static Advice fromResponse(AdviceResponse res) => Advice(
        id: res.id,
        channelId: res.channelId,
        advice: res.advice,
        createdAt: res.createdAt,
      );
}
