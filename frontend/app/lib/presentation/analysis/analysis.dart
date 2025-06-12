import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../core/widgets/lovely_avatar.dart';
import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';
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
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.pink[50],
      appBar: AppBar(
        title: Text(
          local!.translate('analysis'),
          style: const TextStyle(
            fontFamily: 'Nunito',
            fontWeight: FontWeight.bold,
            color: Color(0xFFD81B60),
          ),
        ),
        backgroundColor: Colors.pink[100],
        elevation: 0,
        iconTheme: const IconThemeData(color: Color(0xFFD81B60)),
      ),
      body: Observer(
        builder: (_) {
          if (_store.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.pink,
                size: 40,
              ),
            );
          }
          final analysis = _store.latestAnalysis;
          if (analysis == null) {
            return Center(
              child: Text(
                local!.translate('analysis_load_fail'),
                style: const TextStyle(fontSize: 16, color: Color(0xFFD81B60), fontFamily: 'Nunito'),
              ),
            );
          }
          final result = analysis.parsedResult;
          final user1 = result['user1'] ?? {};
          final user2 = result['user2'] ?? {};
          final user1Name = user1['name'] ?? local!.translate('user1');
          final user2Name = user2['name'] ?? local!.translate('user2');
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
                  Container(
                    decoration: BoxDecoration(
                      gradient: LinearGradient(
                        colors: [Colors.pink[100]!, Colors.blue[50]!],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                      borderRadius: BorderRadius.circular(24),
                      boxShadow: [
                        BoxShadow(
                          color: Colors.pink.withOpacity(0.08),
                          blurRadius: 16,
                          offset: const Offset(0, 8),
                        ),
                      ],
                    ),
                    padding: const EdgeInsets.symmetric(vertical: 18, horizontal: 18),
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        LovelyAvatar(imageUrl: user1Profile),
                        const SizedBox(width: 16),
                        Icon(Icons.favorite, color: Colors.pink[300], size: 36),
                        const SizedBox(width: 16),
                        LovelyAvatar(imageUrl: user2Profile),
                      ],
                    ),
                  ),
                  const SizedBox(height: 16),
                  Center(
                    child: Text(
                      '$user1Name ❤️ $user2Name',
                      style: const TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: Color(0xFFD81B60),
                        fontFamily: 'Nunito',
                      ),
                    ),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    local.translate('couple_mbti_match'),
                    style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold, fontFamily: 'Nunito'),
                  ),
                  const SizedBox(height: 8),
                  Row(
                    children: [
                      Chip(
                        label: Text(user1Mbti, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD81B60))),
                        backgroundColor: Colors.pink[50],
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      Icon(Icons.compare_arrows, color: Colors.pink),
                      Chip(
                        label: Text(user2Mbti, style: const TextStyle(fontWeight: FontWeight.bold, color: Color(0xFFD81B60))),
                        backgroundColor: Colors.pink[50],
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                      ),
                      const SizedBox(width: 12),
                      if (matchPercent.toString().isNotEmpty)
                        Text(
                          '$matchPercent% ${local.translate('good_match')}',
                          style: const TextStyle(fontWeight: FontWeight.bold, color: Colors.pink, fontFamily: 'Nunito'),
                        ),
                    ],
                  ),
                  const SizedBox(height: 24),
                  Text(
                    local.translate('main_keywords'),
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'Nunito'),
                  ),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: keywords.map((k) => Chip(
                      label: Text(k, style: const TextStyle(color: Color(0xFF1976D2))),
                      backgroundColor: Colors.blue[50],
                      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(10)),
                    )).toList(),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    local.translate('analysis_summary'),
                    style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold, fontFamily: 'Nunito'),
                  ),
                  const SizedBox(height: 8),
                  Text(result['summary'] ?? '', style: const TextStyle(fontSize: 15, fontFamily: 'Nunito')),
                  if (result['advice'] != null)
                    Text('${local.translate('advice')}: ${result['advice']}', style: const TextStyle(fontSize: 15, fontFamily: 'Nunito')),
                  if (result['persona1'] != null)
                    Text('${local.translate('user1_persona')}: ${result['persona1']}', style: const TextStyle(fontSize: 15, fontFamily: 'Nunito')),
                  if (result['persona2'] != null)
                    Text('${local.translate('user2_persona')}: ${result['persona2']}', style: const TextStyle(fontSize: 15, fontFamily: 'Nunito')),
                  const SizedBox(height: 80),
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
              ? LoadingAnimationWidget.staggeredDotsWave(
                  color: Colors.white,
                  size: 28,
                )
              : const Icon(Icons.refresh),
          backgroundColor: Colors.pink,
        ),
      ),
    );
  }
}
