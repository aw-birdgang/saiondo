import 'dart:convert';

import '../../data/network/dto/analysis_response.dart';

class CoupleAnalysis {
  final String id;
  final String channelId;
  final String rawResult;
  final DateTime createdAt;

  CoupleAnalysis({
    required this.id,
    required this.channelId,
    required this.rawResult,
    required this.createdAt,
  });

  factory CoupleAnalysis.fromJson(Map<String, dynamic> json) {
    return CoupleAnalysis(
      id: json['id'],
      channelId: json['channelId'],
      rawResult: json['rawResult'],
      createdAt: DateTime.parse(json['createdAt']),
    );
  }

  // LLM 결과 파싱 (rawResult는 JSON string)
  Map<String, dynamic> get parsedResult {
    try {
      return rawResult.isNotEmpty
          ? Map<String, dynamic>.from(jsonDecode(rawResult))
          : {};
    } catch (_) {
      return {'summary': rawResult}; // 혹시 JSON이 아니면 원문 출력
    }
  }

  AnalysisResponse? get analysisResponse {
    try {
      final parsed = parsedResult;
      if (parsed.isNotEmpty) {
        return AnalysisResponse.fromJson(parsed);
      }
    } catch (_) {}
    return null;
  }
}
