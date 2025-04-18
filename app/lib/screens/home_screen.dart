import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:firebase_auth/firebase_auth.dart';
import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../models/emotion_log.dart';
import '../widgets/couple_profile_card.dart';

class HomeScreen extends StatelessWidget {
  const HomeScreen({super.key});

  Future<Map<String, dynamic>> fetchCoupleProfile(String userId) async {
    final userDoc = await FirebaseFirestore.instance.collection('users').doc(userId).get();
    final userData = userDoc.data();

    if (userData == null || !userData.containsKey('coupleId')) {
      throw Exception("❌ 커플 정보가 없습니다.");
    }

    final coupleId = userData['coupleId'];
    final coupleDoc = await FirebaseFirestore.instance.collection('couples').doc(coupleId).get();
    final coupleData = coupleDoc.data();

    if (coupleData == null) {
      throw Exception("❌ 커플 정보가 존재하지 않습니다.");
    }

    final String userAId = coupleData['userAId'];
    final String userBId = coupleData['userBId'];

    if (userId != userAId && userId != userBId) {
      throw Exception("❌ 유저는 해당 커플에 포함되어 있지 않습니다.");
    }

    final partnerId = userId == userAId ? userBId : userAId;
    final partnerDoc = await FirebaseFirestore.instance.collection('users').doc(partnerId).get();
    final partnerData = partnerDoc.data();

    return {
      "me": userData,
      "partner": partnerData,
      "couple": coupleData,
    };
  }

  @override
  Widget build(BuildContext context) {
    final currentUser = FirebaseAuth.instance.currentUser;

    if (currentUser == null) {
      return const Center(child: Text("로그인이 필요합니다."));
    }

    final currentUserId = currentUser.uid;

    return FutureBuilder(
      future: fetchCoupleProfile(currentUserId),
      builder: (context, snapshot) {
        if (snapshot.connectionState == ConnectionState.waiting) {
          return const Center(child: CircularProgressIndicator());
        }
        if (snapshot.hasError || !snapshot.hasData) {
          // 에러가 있거나 데이터가 없을 경우 빈 화면 처리
          return Container();
        }

        final data = snapshot.data!;
        final me = data['me'];
        final partner = data['partner'];
        final couple = data['couple'];

        return ValueListenableBuilder(
          valueListenable: Hive.box<EmotionLog>('emotionLogs').listenable(),
          builder: (context, Box<EmotionLog> box, _) {
            final logs = box.values.toList().reversed.take(3).toList();
            final myTemp = logs.isNotEmpty ? logs.first.temperature : 50;

            return SingleChildScrollView(
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  const SizedBox(height: 24),
                  CoupleProfileCard(
                    myName: me['name'],
                    myMbti: me['mbti'] ?? '',
                    myLang: me['loveLanguage'] ?? '',
                    myAvatar: me['avatarUrl'] ?? '',
                    partnerName: partner['name'],
                    partnerMbti: partner['mbti'] ?? '',
                    partnerLang: partner['loveLanguage'] ?? '',
                    partnerAvatar: partner['avatarUrl'] ?? '',
                    startDate: (couple['startDate'] as Timestamp).toDate(),
                    statusMessage: couple['statusMessage'] ?? '',
                  ),
                  const SizedBox(height: 16),
                  Padding(
                    padding: const EdgeInsets.symmetric(horizontal: 16),
                    child: Column(
                      children: [
                        _buildGauge("나의 감정 😊", myTemp, Colors.pink),
                        const SizedBox(height: 16),
                        _buildGauge("상대방 감정 😐", 65, Colors.amber),
                        const SizedBox(height: 12),
                        _buildEmotionFeedback(),
                        const SizedBox(height: 24),
                        ElevatedButton.icon(
                          onPressed: () => Navigator.pushNamed(context, "/emotion"),
                          icon: const Icon(Icons.edit),
                          label: const Text("오늘의 감정 입력하기"),
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.pinkAccent,
                            foregroundColor: Colors.white,
                            minimumSize: const Size.fromHeight(44),
                          ),
                        ),
                      ],
                    ),
                  ),
                  const SizedBox(height: 24),
                  _buildRecentEmotionLogs(context, logs),
                  const SizedBox(height: 16),
                  _buildDailyTip(),
                  const SizedBox(height: 24),
                ],
              ),
            );
          },
        );
      },
    );
  }

  Widget _buildGauge(String label, int value, Color color) {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Text(label, style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 4),
        Stack(
          children: [
            Container(
              height: 12,
              decoration: BoxDecoration(
                color: Colors.grey[300],
                borderRadius: BorderRadius.circular(8),
              ),
            ),
            Container(
              height: 12,
              width: (value / 100) * 300,
              decoration: BoxDecoration(
                color: color,
                borderRadius: BorderRadius.circular(8),
              ),
            ),
          ],
        ),
        const SizedBox(height: 4),
        Text("$value°", style: const TextStyle(fontSize: 12)),
      ],
    );
  }

  Widget _buildEmotionFeedback() {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(12),
      decoration: BoxDecoration(
        color: Colors.pink.shade50,
        borderRadius: BorderRadius.circular(12),
      ),
      child: const Text(
        "오늘 두 분의 감정은 안정적이에요.\n가볍게 산책하며 감정을 나눠보세요 💬",
        style: TextStyle(fontSize: 13),
      ),
    );
  }

  Widget _buildRecentEmotionLogs(BuildContext context, List<EmotionLog> logs) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Card(
        elevation: 1,
        child: Padding(
          padding: const EdgeInsets.all(12),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                mainAxisAlignment: MainAxisAlignment.spaceBetween,
                children: [
                  const Text("최근 감정", style: TextStyle(fontWeight: FontWeight.bold)),
                  TextButton(
                    onPressed: () => Navigator.pushNamed(context, "/emotion-history"),
                    child: const Text("감정 기록 전체 보기 →"),
                  ),
                ],
              ),
              const SizedBox(height: 8),
              if (logs.isEmpty)
                const Text("최근 감정 기록이 없습니다."),
              ...logs.map((log) => Padding(
                padding: const EdgeInsets.symmetric(vertical: 4),
                child: Row(
                  children: [
                    SizedBox(width: 60, child: Text(log.date)),
                    const SizedBox(width: 12),
                    Text("${log.emoji}  ${log.temperature}°"),
                  ],
                ),
              )),
            ],
          ),
        ),
      ),
    );
  }

  Widget _buildDailyTip() {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Container(
        padding: const EdgeInsets.all(12),
        decoration: BoxDecoration(
          color: Colors.amber.shade50,
          borderRadius: BorderRadius.circular(12),
        ),
        child: const Text(
          "💡 오늘의 팁:\n말보다 따뜻한 표정 하나가 마음을 더 움직여요.",
          style: TextStyle(fontSize: 13),
        ),
      ),
    );
  }
}