import 'package:flutter/material.dart';

class ChallengeScreen extends StatefulWidget {
  const ChallengeScreen({super.key});

  @override
  State<ChallengeScreen> createState() => _ChallengeScreenState();
}

class _ChallengeScreenState extends State<ChallengeScreen> {
  bool loading = true;
  final Set<String> completed = {};

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      setState(() => loading = false);
    });
  }

  void toggleComplete(String id) {
    setState(() {
      if (completed.contains(id)) {
        completed.remove(id);
      } else {
        completed.add(id);
      }
    });
  }

  Widget buildChallengeCard({
    required String id,
    required String title,
    required String description,
    required int points,
  }) {
    final isDone = completed.contains(id);
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Row(
              children: [
                const Icon(Icons.flag, color: Colors.pinkAccent),
                const SizedBox(width: 8),
                Text(title, style: const TextStyle(fontWeight: FontWeight.bold)),
                const Spacer(),
                Text("+$points", style: const TextStyle(color: Colors.grey)),
              ],
            ),
            const SizedBox(height: 8),
            Text(description),
            const SizedBox(height: 12),
            ElevatedButton.icon(
              onPressed: isDone ? null : () => toggleComplete(id),
              icon: Icon(isDone ? Icons.check : Icons.play_arrow),
              label: Text(isDone ? "완료됨" : "도전하기"),
              style: ElevatedButton.styleFrom(
                backgroundColor: isDone ? Colors.grey : Colors.pinkAccent,
                minimumSize: const Size.fromHeight(40),
              ),
            )
          ],
        ),
      ),
    );
  }

  final List<Map<String, dynamic>> dailyChallenges = [
    {
      "id": "d1",
      "title": "함께 산책하기",
      "desc": "15분 이상 함께 산책하며 대화하기",
      "points": 5,
    },
    {
      "id": "d2",
      "title": "감사 표현하기",
      "desc": "오늘 감사한 일 하나를 말하기",
      "points": 3,
    },
    {
      "id": "d3",
      "title": "사진 한 장 공유하기",
      "desc": "오늘 찍은 사진을 상대방에게 보내기",
      "points": 3,
    },
  ];

  final List<Map<String, dynamic>> weeklyChallenges = [
    {
      "id": "w1",
      "title": "데이트 계획하기",
      "desc": "다음 주 데이트를 함께 계획해요",
      "points": 10,
    },
    {
      "id": "w2",
      "title": "취미 공유하기",
      "desc": "상대방의 취미를 함께 체험해보기",
      "points": 8,
    },
    {
      "id": "w3",
      "title": "추억 이야기하기",
      "desc": "가장 행복했던 순간에 대해 이야기해요",
      "points": 7,
    },
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            const Text("오늘의 챌린지", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 12),
            ...dailyChallenges.map((c) => buildChallengeCard(
              id: c['id'] as String,
              title: c['title'] as String,
              description: c['desc'] as String,
              points: c['points'] as int,
            )),
            const SizedBox(height: 24),
            const Text("주간 챌린지", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18)),
            const SizedBox(height: 12),
            ...weeklyChallenges.map((c) => buildChallengeCard(
              id: c['id'] as String,
              title: c['title'] as String,
              description: c['desc'] as String,
              points: c['points'] as int,
            )),
            const SizedBox(height: 24),

            // 추가 챌린지
            Card(
              child: ListTile(
                leading: const Icon(Icons.favorite, color: Colors.pinkAccent),
                title: const Text("하루 한 칭찬"),
                subtitle: const Text("상대방에게 따뜻한 칭찬을 전달해보세요"),
                trailing: TextButton(
                  onPressed: () => Navigator.pushNamed(context, '/compliment'),
                  child: const Text("칭찬하기"),
                ),
              ),
            ),
            const SizedBox(height: 8),
            Card(
              child: ListTile(
                leading: const Icon(Icons.mail, color: Colors.pinkAccent),
                title: const Text("AI 편지 보내기"),
                subtitle: const Text("Claude가 대신 작성해줄 수 있어요"),
                trailing: TextButton(
                  onPressed: () {
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text("아직 준비 중이에요 🛠️")),
                    );
                  },
                  child: const Text("준비중"),
                ),
              ),
            ),
          ],
        ),
      ),
    );
  }
}