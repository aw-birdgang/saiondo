import 'dart:convert';

class AnalysisResponse {
  final String id;
  final String channelId;
  final String rawResult;
  final DateTime createdAt;

  // rawResult 파싱 결과
  final String summary;
  final String advice;
  final String persona1;
  final String persona2;
  final List<String> keywords;

  AnalysisResponse({
    required this.id,
    required this.channelId,
    required this.rawResult,
    required this.createdAt,
    required this.summary,
    required this.advice,
    required this.persona1,
    required this.persona2,
    required this.keywords,
  });

  factory AnalysisResponse.fromJson(Map<String, dynamic> json) {
    // rawResult 파싱
    Map<String, dynamic> parsed = {};
    final rawResult = json['rawResult'] as String? ?? '';
    try {
      parsed = rawResult.isNotEmpty ? Map<String, dynamic>.from(jsonDecode(rawResult)) : {};
    } catch (_) {
      parsed = {'summary': rawResult};
    }
    return AnalysisResponse(
      id: json['id'],
      channelId: json['channelId'],
      rawResult: rawResult,
      createdAt: DateTime.parse(json['createdAt']),
      summary: parsed['summary'] ?? '',
      advice: parsed['advice'] ?? '',
      persona1: parsed['persona1'] ?? '',
      persona2: parsed['persona2'] ?? '',
      keywords: List<String>.from(parsed['keywords'] ?? []),
    );
  }
}
