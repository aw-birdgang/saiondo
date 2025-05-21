import 'package:flutter/material.dart';

class AnalysisScreen extends StatelessWidget {
  final String channelId;
  final String userId;

  const AnalysisScreen({super.key, required this.channelId, required this.userId});

  @override
  Widget build(BuildContext context) {
    // 실제로는 MobX store 또는 FutureBuilder로 서버에서 데이터 받아오기
    // 예시: final analysis = await analysisStore.fetchAnalysis(channelId);

    // 샘플 데이터
    final mbti1 = "INFP";
    final mbti2 = "ESTJ";
    final matchPercent = 72;
    final keywords = ["사랑", "신뢰", "여행"];
    final analysisSummary = "두 분은 서로의 차이를 존중할 때 더욱 잘 맞는 커플입니다!";

    return Scaffold(
      appBar: AppBar(
        title: Text('성향분석'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text('커플 MBTI 궁합', style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold)),
            SizedBox(height: 16),
            Row(
              children: [
                Chip(label: Text(mbti1)),
                Icon(Icons.compare_arrows, color: Colors.pink),
                Chip(label: Text(mbti2)),
                SizedBox(width: 12),
                Text('$matchPercent% 잘 맞아요!', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.pink)),
              ],
            ),
            SizedBox(height: 24),
            Text('주요 키워드', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Wrap(
              spacing: 8,
              children: keywords.map((k) => Chip(label: Text(k))).toList(),
            ),
            SizedBox(height: 24),
            Text('분석 요약', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
            SizedBox(height: 8),
            Text(analysisSummary, style: TextStyle(fontSize: 16)),
          ],
        ),
      ),
    );
  }
}
