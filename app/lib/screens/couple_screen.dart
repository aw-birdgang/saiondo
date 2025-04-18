import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

import '../services/auth_service.dart';
import '../widgets/couple_profile_card.dart';

class CoupleScreen extends StatelessWidget {
  const CoupleScreen({super.key});

  Future<Map<String, dynamic>> fetchCoupleData(String userId) async {
    final firestore = FirebaseFirestore.instance;

    // 커플 정보 가져오기
    final coupleA = await firestore
        .collection('couples')
        .where('userAId', isEqualTo: userId)
        .limit(1)
        .get();

    DocumentSnapshot coupleDoc;
    if (coupleA.docs.isNotEmpty) {
      coupleDoc = coupleA.docs.first;
    } else {
      final coupleB = await firestore
          .collection('couples')
          .where('userBId', isEqualTo: userId)
          .limit(1)
          .get();

      if (coupleB.docs.isEmpty) {
        throw Exception("커플 정보를 찾을 수 없습니다.");
      }

      coupleDoc = coupleB.docs.first;
    }

    final coupleData = coupleDoc.data() as Map<String, dynamic>;
    final partnerId = coupleData['userAId'] == userId
        ? coupleData['userBId']
        : coupleData['userAId'];

    final partnerSnapshot =
    await firestore.collection('users').doc(partnerId).get();
    final partnerData = partnerSnapshot.data() as Map<String, dynamic>;

    return {
      "couple": coupleData,
      "partner": partnerData,
    };
  }

  @override
  Widget build(BuildContext context) {
    final userId = AuthService.currentUserId;
    if (userId == null) {
      return const Center(child: Text("로그인이 필요합니다."));
    }
    return Scaffold(
      appBar: AppBar(
        title: const Text("우리 커플"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: FutureBuilder<Map<String, dynamic>>(
        future: fetchCoupleData(userId),
        builder: (context, snapshot) {
          if (snapshot.connectionState == ConnectionState.waiting) {
            return const Center(child: CircularProgressIndicator());
          }

          if (!snapshot.hasData || snapshot.hasError) {
            return const Center(child: Text("커플 정보를 불러올 수 없어요 😢"));
          }

          final couple = snapshot.data!['couple'];
          final partner = snapshot.data!['partner'];

          final startDate = (couple['startDate'] as Timestamp).toDate();
          final statusMessage = couple['statusMessage'] ?? "오늘도 좋은 하루!";
          final dday = DateTime.now().difference(startDate).inDays;

          return SingleChildScrollView(
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                CoupleProfileCard(
                  myName: "홍길동", // TODO: 본인 정보로 바꾸기
                  myMbti: "ENFP",
                  myLang: "Words",
                  myAvatar: "https://i.pravatar.cc/150?img=3",
                  partnerName: partner['name'] ?? "상대방",
                  partnerMbti: partner['mbti'] ?? "???",
                  partnerLang: partner['loveLanguage'] ?? "???",
                  partnerAvatar: partner['avatarUrl'] ?? "",
                  startDate: startDate,
                  statusMessage: statusMessage,
                ),
                const SizedBox(height: 16),

                // 💖 D-day
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.pink.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.favorite, color: Colors.pink),
                      const SizedBox(width: 8),
                      const Text("우리가 함께한 지 "),
                      Text("D+$dday", style: const TextStyle(fontWeight: FontWeight.bold)),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // 😊 오늘 감정 요약 (임시 값)
                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.amber.shade50,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: const [
                      Text("오늘의 감정 상태", style: TextStyle(fontWeight: FontWeight.bold)),
                      SizedBox(height: 8),
                      Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text("나: 😊 78°"),
                          Text("상대방: 😐 65°"),
                        ],
                      ),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // 📝 상태 메시지
                Container(
                  width: double.infinity,
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: Colors.grey.shade100,
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Row(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Icon(Icons.chat, color: Colors.blueAccent),
                      const SizedBox(width: 8),
                      Expanded(child: Text("상태 메시지: $statusMessage")),
                    ],
                  ),
                ),
                const SizedBox(height: 16),

                // 🎯 미션
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.flag, color: Colors.pink),
                    title: const Text("커플 미션"),
                    subtitle: const Text("오늘의 미션 도전해보세요!"),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => Navigator.pushNamed(context, "/challenge"),
                  ),
                ),
                const SizedBox(height: 8),

                // 🎁 기념일
                Card(
                  child: ListTile(
                    leading: const Icon(Icons.event, color: Colors.purple),
                    title: const Text("기념일 보기"),
                    subtitle: const Text("우리만의 특별한 날들 💕"),
                    trailing: const Icon(Icons.chevron_right),
                    onTap: () => Navigator.pushNamed(context, "/anniversaries"),
                  ),
                ),
                const SizedBox(height: 24),
              ],
            ),
          );
        },
      ),
    );
  }
}