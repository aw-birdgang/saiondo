import '../../domain/entry/couple_analysis.dart';
import '../network/dto/analysis_response.dart';

class CoupleAnalysisAdapter {
  static CoupleAnalysis fromResponse(AnalysisResponse res) => CoupleAnalysis(
        id: res.id,
        channelId: res.channelId,
        rawResult: res.rawResult,
        createdAt: res.createdAt,
      );

  static AnalysisResponse toResponse(CoupleAnalysis entity) {
    return AnalysisResponse.fromJson({
      'id': entity.id,
      'channelId': entity.channelId,
      'rawResult': entity.rawResult,
      'createdAt': entity.createdAt.toIso8601String(),
    });
  }
}
