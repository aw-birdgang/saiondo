class AnalysisResponse {
  final UserSummary user1;
  final UserSummary user2;
  final int matchPercent;
  final List<String> keywords;
  final String summary;

  AnalysisResponse({
    required this.user1,
    required this.user2,
    required this.matchPercent,
    required this.keywords,
    required this.summary,
  });

  factory AnalysisResponse.fromJson(Map<String, dynamic> json) => AnalysisResponse(
        user1: UserSummary.fromJson(json['user1']),
        user2: UserSummary.fromJson(json['user2']),
        matchPercent: json['matchPercent'],
        keywords: List<String>.from(json['keywords']),
        summary: json['summary'],
      );
}

class UserSummary {
  final String id;
  final String name;
  final String mbti;
  final String? profileUrl;

  UserSummary({
    required this.id,
    required this.name,
    required this.mbti,
    this.profileUrl,
  });

  factory UserSummary.fromJson(Map<String, dynamic> json) => UserSummary(
        id: json['id'],
        name: json['name'],
        mbti: json['mbti'],
        profileUrl: json['profileUrl'],
      );
}
