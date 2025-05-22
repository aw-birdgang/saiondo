import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import 'store/analysis_store.dart';

class AnalysisScreen extends StatefulWidget {
  final String channelId;
  const AnalysisScreen({super.key, required this.channelId});

  @override
  State<AnalysisScreen> createState() => _AnalysisScreenState();
}

class _AnalysisScreenState extends State<AnalysisScreen> {
  final AnalysisStore _store = getIt<AnalysisStore>();

  @override
  void initState() {
    super.initState();
    _store.loadAnalyses(widget.channelId);
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('성향분석'),
        backgroundColor: Colors.blueAccent,
      ),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return Center(child: CircularProgressIndicator());
          }
          final analysis = _store.latestAnalysis;
          if (analysis == null) {
            return Center(child: Text('분석 정보를 불러올 수 없습니다.'));
          }
          final result = analysis.parsedResult;
          // null-safe 추출
          final user1 = result['user1'] ?? {};
          final user2 = result['user2'] ?? {};
          final user1Name = user1['name'] ?? '유저1';
          final user2Name = user2['name'] ?? '유저2';
          final user1Profile = user1['profileUrl'] ?? '';
          final user2Profile = user2['profileUrl'] ?? '';
          final user1Mbti = user1['mbti'] ?? '';
          final user2Mbti = user2['mbti'] ?? '';
          final matchPercent = result['matchPercent'] ?? '';
          final keywords = (result['keywords'] as List?)?.cast<String>() ?? [];

          return Padding(
            padding: const EdgeInsets.all(24),
            child: SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  // 커플 프로필
                  Row(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      CircleAvatar(
                        backgroundImage: user1Profile.isNotEmpty
                            ? NetworkImage(user1Profile)
                            : null,
                        radius: 32,
                        child: user1Profile.isEmpty ? Icon(Icons.person) : null,
                      ),
                      SizedBox(width: 16),
                      Icon(Icons.favorite, color: Colors.pink, size: 32),
                      SizedBox(width: 16),
                      CircleAvatar(
                        backgroundImage: user2Profile.isNotEmpty
                            ? NetworkImage(user2Profile)
                            : null,
                        radius: 32,
                        child: user2Profile.isEmpty ? Icon(Icons.person) : null,
                      ),
                    ],
                  ),
                  SizedBox(height: 16),
                  Center(
                    child: Text(
                      '$user1Name ❤️ $user2Name',
                      style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.pink[700]),
                    ),
                  ),
                  SizedBox(height: 24),
                  Text('커플 MBTI 궁합', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Row(
                    children: [
                      Chip(label: Text(user1Mbti)),
                      Icon(Icons.compare_arrows, color: Colors.pink),
                      Chip(label: Text(user2Mbti)),
                      SizedBox(width: 12),
                      if (matchPercent.toString().isNotEmpty)
                        Text('$matchPercent% 잘 맞아요!', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.pink)),
                    ],
                  ),
                  SizedBox(height: 24),
                  Text('주요 키워드', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: keywords.map((k) => Chip(label: Text(k))).toList(),
                  ),
                  SizedBox(height: 24),
                  Text('분석 요약', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                  SizedBox(height: 8),
                  Text(result['summary'] ?? '', style: TextStyle(fontSize: 15)),
                  if (result['advice'] != null)
                    Text('조언: ${result['advice']}', style: TextStyle(fontSize: 15)),
                  if (result['persona1'] != null)
                    Text('유저1 페르소나: ${result['persona1']}', style: TextStyle(fontSize: 15)),
                  if (result['persona2'] != null)
                    Text('유저2 페르소나: ${result['persona2']}', style: TextStyle(fontSize: 15)),
                  SizedBox(height: 80),
                ],
              ),
            ),
          );
        },
      ),
      floatingActionButton: Observer(
        builder: (_) => FloatingActionButton(
          onPressed: _store.isCreating
              ? null
              : () async {
                  await _store.createAnalysis(widget.channelId);
                },
          child: _store.isCreating
              ? CircularProgressIndicator(color: Colors.white)
              : Icon(Icons.refresh),
          backgroundColor: Colors.pink,
        ),
      ),
    );
  }
}
