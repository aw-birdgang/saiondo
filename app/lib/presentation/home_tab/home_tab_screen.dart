import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../models/emotion_log.dart';
import '../../widgets/couple_profile_card.dart';
import '../widgets/emotion_logs_list.dart';
import 'store/home_tab_store.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});

  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  late final HomeTabStore _store;
  final ScrollController _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _store = getIt<HomeTabStore>();
    _store.init();
  }

  @override
  void dispose() {
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Observer(
        builder: (_) => _buildBody(),
      ),
    );
  }

  Widget _buildBody() {
    if (_store.isLoading) {
      return const Center(child: CircularProgressIndicator());
    }

    final coupleData = _store.coupleProfileData;
    if (coupleData == null) {
      return _buildErrorState();
    }

    return _buildMainContent(coupleData);
  }

  Widget _buildErrorState() {
    return Center(
      child: Column(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          const Text("커플 정보를 불러올 수 없습니다."),
          ElevatedButton(
            onPressed: _store.reflesh,
            child: const Text("다시 시도"),
          ),
        ],
      ),
    );
  }

  Widget _buildMainContent(Map<String, dynamic> coupleData) {
    final me = coupleData['me'];
    final partner = coupleData['partner'];
    final couple = coupleData['couple'];
    final startDate = _getStartDate(couple['startDate']);
    final myTemp = _getMyTemperature();

    return RefreshIndicator(
      onRefresh: () async {
        try {
          await _store.reflesh();
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              const SnackBar(
                content: Text('새로고침 완료'),
                duration: Duration(seconds: 1),
              ),
            );
          }
        } catch (e) {
          if (mounted) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(
                content: Text('새로고침 실패: $e'),
                backgroundColor: Colors.red,
              ),
            );
          }
        }
      },
      child: ListView(
        physics: const AlwaysScrollableScrollPhysics(),
        controller: _scrollController,
        children: [
          const SizedBox(height: 24),
          _buildCoupleProfile(me, partner, couple, startDate),
          const SizedBox(height: 16),
          _buildEmotionSection(myTemp),
          const SizedBox(height: 24),
          _buildRecentEmotionLogs(context, _store.recentLogs),
          const SizedBox(height: 16),
          _buildDailyTip(),
          const SizedBox(height: 24),
        ],
      ),
    );
  }

  DateTime _getStartDate(dynamic startDate) {
    return startDate is Timestamp ? startDate.toDate() : DateTime.now();
  }

  int _getMyTemperature() {
    return _store.recentLogs.isNotEmpty ? _store.recentLogs.first.temperature : 50;
  }

  Widget _buildCoupleProfile(
      Map<String, dynamic> me,
      Map<String, dynamic> partner,
      Map<String, dynamic> couple,
      DateTime startDate,
      ) {
    return CoupleProfileCard(
      myName: me['name'] ?? '',
      myMbti: me['mbti'] ?? '',
      myLang: me['loveLanguage'] ?? '',
      myAvatar: me['avatarUrl'] ?? '',
      partnerName: partner['name'] ?? '',
      partnerMbti: partner['mbti'] ?? '',
      partnerLang: partner['loveLanguage'] ?? '',
      partnerAvatar: partner['avatarUrl'] ?? '',
      startDate: startDate,
      statusMessage: couple['statusMessage'] ?? '',
    );
  }

  Widget _buildEmotionSection(int myTemp) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        children: [
          _buildGauge("나의 감정 😊", myTemp, Colors.pink),
          const SizedBox(height: 16),
          _buildGauge("상대방 감정 😐", 65, Colors.amber),
          const SizedBox(height: 12),
          _buildEmotionFeedback(),
          const SizedBox(height: 24),
          _buildEmotionInputButton(),
        ],
      ),
    );
  }

  Widget _buildEmotionInputButton() {
    return ElevatedButton.icon(
      onPressed: () => Navigator.pushNamed(context, "/emotion"),
      icon: const Icon(Icons.edit),
      label: const Text("오늘의 감정 입력하기"),
      style: ElevatedButton.styleFrom(
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
        minimumSize: const Size.fromHeight(44),
      ),
    );
  }

  Widget _buildGauge(String title, int value, Color color) {
    final safeValue = value.clamp(0, 100);
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Container(
          height: 20,
          decoration: BoxDecoration(
            color: Colors.grey.shade200,
            borderRadius: BorderRadius.circular(10),
          ),
          child: Row(
            children: [
              Flexible(
                flex: safeValue,
                child: Container(
                  decoration: BoxDecoration(
                    color: color,
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
              ),
              Flexible(flex: 100 - safeValue, child: Container()),
            ],
          ),
        ),
      ],
    );
  }

  Widget _buildEmotionFeedback() {
    return Card(
      elevation: 1,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: const Padding(
        padding: EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text("감정 피드백", style: TextStyle(fontWeight: FontWeight.bold)),
            SizedBox(height: 4),
            Text("오늘 당신과 파트너의 감정 상태가 비슷하네요! 함께 좋은 하루를 보내고 있군요 😊"),
          ],
        ),
      ),
    );
  }

  Widget _buildRecentEmotionLogs(BuildContext context, List<EmotionLog> logs) {
    return EmotionLogsList(logs: logs);
  }

  Widget _buildDailyTip() {
    final tip = _store.currentDailyTip;
    if (tip == null) {
      debugPrint('Daily Tip이 없습니다.');
      return const SizedBox.shrink();
    }

    final paragraphs = tip.content.split('\n\n').where((p) => p.trim().isNotEmpty).toList();

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "오늘의 연애 팁",
                style: TextStyle(
                  fontWeight: FontWeight.bold,
                  fontSize: 18,
                  color: Theme.of(context).primaryColor,
                ),
              ),
              IconButton(
                icon: const Icon(Icons.refresh),
                onPressed: () async {
                  try {
                    // 로딩 표시
                    showDialog(
                      context: context,
                      barrierDismissible: false,
                      builder: (context) => const Center(
                        child: CircularProgressIndicator(),
                      ),
                    );
                    await _store.updateDailyTipsWithEmotion();
                    if (mounted) {
                      Navigator.of(context).pop();
                    }
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(
                          content: Text('새로운 연애 팁이 업데이트 되었습니다'),
                          duration: Duration(seconds: 2),
                        ),
                      );
                    }
                  } catch (e) {
                    if (mounted) {
                      Navigator.of(context).pop();
                    }

                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(
                          content: Text('업데이트 실패: $e'),
                          backgroundColor: Colors.red,
                          duration: const Duration(seconds: 3),
                        ),
                      );
                    }
                  }
                },
                tooltip: '새로운 연애 팁 받기',
              ),
            ],
          ),
          const SizedBox(height: 8),
          Card(
            elevation: 2,
            shape: RoundedRectangleBorder(
              borderRadius: BorderRadius.circular(12),
            ),
            child: Padding(
              padding: const EdgeInsets.all(16),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Icon(
                        _getTipIcon(tip.category),
                        color: _getTipColor(tip.category),
                      ),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          tip.title,
                          style: const TextStyle(
                            fontWeight: FontWeight.bold,
                            fontSize: 16,
                          ),
                        ),
                      ),
                    ],
                  ),
                  const SizedBox(height: 8),
                  ConstrainedBox(
                    constraints: const BoxConstraints(
                      maxHeight: 200,
                    ),
                    child: SingleChildScrollView(
                      physics: const AlwaysScrollableScrollPhysics(),
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          ...paragraphs.map((paragraph) => Padding(
                            padding: const EdgeInsets.only(bottom: 8),
                            child: Text(
                              paragraph.trim(),
                              style: const TextStyle(
                                fontSize: 14,
                                height: 1.5,
                              ),
                            ),
                          )),
                          if (paragraphs.length > 2)  // 긴 내용일 경우 스크롤 힌트
                            const Center(
                              child: Icon(
                                Icons.keyboard_arrow_down,
                                color: Colors.grey,
                                size: 20,
                              ),
                            ),
                        ],
                      ),
                    ),
                  ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  IconData _getTipIcon(String category) {
    switch (category) {
      case 'mood_improvement':
        return Icons.mood;
      case 'relationship_growth':
        return Icons.favorite;
      case 'emotional_support':
        return Icons.healing;
      case 'conflict_resolution':
        return Icons.handshake;
      default:
        return Icons.tips_and_updates;
    }
  }

  Color _getTipColor(String category) {
    switch (category) {
      case 'mood_improvement':
        return Colors.amber;
      case 'relationship_growth':
        return Colors.pink;
      case 'emotional_support':
        return Colors.blue;
      case 'conflict_resolution':
        return Colors.green;
      default:
        return Colors.purple;
    }
  }


}








