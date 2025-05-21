import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'store/analysis_store.dart';
import '../../di/service_locator.dart';

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
    _store.loadAnalysis(widget.channelId);
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
          final analysis = _store.analysis;
          if (analysis == null) {
            return Center(child: Text('분석 정보를 불러올 수 없습니다.'));
          }
          return Padding(
            padding: const EdgeInsets.all(24),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // 커플 프로필
                Row(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    CircleAvatar(
                      backgroundImage: NetworkImage(analysis.user1.profileUrl ?? ''),
                      radius: 32,
                    ),
                    SizedBox(width: 16),
                    Icon(Icons.favorite, color: Colors.pink, size: 32),
                    SizedBox(width: 16),
                    CircleAvatar(
                      backgroundImage: NetworkImage(analysis.user2.profileUrl ?? ''),
                      radius: 32,
                    ),
                  ],
                ),
                SizedBox(height: 16),
                Center(
                  child: Text(
                    '${analysis.user1.name} ❤️ ${analysis.user2.name}',
                    style: TextStyle(fontSize: 20, fontWeight: FontWeight.bold, color: Colors.pink[700]),
                  ),
                ),
                SizedBox(height: 24),
                Text('커플 MBTI 궁합', style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Row(
                  children: [
                    Chip(label: Text(analysis.user1.mbti)),
                    Icon(Icons.compare_arrows, color: Colors.pink),
                    Chip(label: Text(analysis.user2.mbti)),
                    SizedBox(width: 12),
                    Text('${analysis.matchPercent}% 잘 맞아요!', style: TextStyle(fontWeight: FontWeight.bold, color: Colors.pink)),
                  ],
                ),
                SizedBox(height: 24),
                Text('주요 키워드', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Wrap(
                  spacing: 8,
                  children: analysis.keywords.map((k) => Chip(label: Text(k))).toList(),
                ),
                SizedBox(height: 24),
                Text('분석 요약', style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold)),
                SizedBox(height: 8),
                Text(analysis.summary, style: TextStyle(fontSize: 15)),
              ],
            ),
          );
        },
      ),
    );
  }
}
