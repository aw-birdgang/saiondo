import 'package:flutter/material.dart';

class FeedbackScreen extends StatefulWidget {
  const FeedbackScreen({super.key});

  @override
  State<FeedbackScreen> createState() => _FeedbackScreenState();
}

class _FeedbackScreenState extends State<FeedbackScreen> {
  bool loading = true;
  bool liked = false;

  final List<int> last7Temps = [35, 45, 60, 50, 65, 70, 75];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      setState(() => loading = false);
    });
  }

  void handleLike() {
    setState(() {
      liked = true;
    });
    Future.delayed(const Duration(seconds: 1), () {
      Navigator.pushReplacementNamed(context, '/home');
    });
  }

  Widget buildBarChart() {
    return Row(
      crossAxisAlignment: CrossAxisAlignment.end,
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: last7Temps.map((temp) {
        double height = (temp / 100) * 120;
        Color color;
        if (temp < 50) {
          color = Colors.blue.shade300;
        } else if (temp < 70) {
          color = Colors.green.shade400;
        } else {
          color = Colors.orange.shade400;
        }

        return Column(
          mainAxisAlignment: MainAxisAlignment.end,
          children: [
            Container(
              width: 12,
              height: height,
              color: color,
            ),
            const SizedBox(height: 4),
            Text("$temp°", style: const TextStyle(fontSize: 10)),
          ],
        );
      }).toList(),
    );
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("AI 피드백"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: loading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            // 감정 요약 카드
            const Card(
              child: Padding(
                padding: EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("감정 요약", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 12),
                    Text(
                        "오늘 당신은 대체로 긍정적인 감정(75°)을 느끼고 있어요. 행복과 만족감이 주된 감정입니다."),
                    SizedBox(height: 12),
                    Text(
                        "상대방은 중간 수준의 감정(65°)을 느끼고 있고, 약간의 피로와 스트레스가 있는 상태입니다."),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // AI 제안 카드
            Card(
              color: Colors.pinkAccent.withOpacity(0.1),
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: const [
                    Text("AI 제안 💡", style: TextStyle(fontWeight: FontWeight.bold)),
                    SizedBox(height: 8),
                    Text(
                      "상대방이 조금 지쳐 있을 수 있어요. 따뜻한 말 한마디나 작은 배려로 감정을 나눠보는 건 어떨까요? 😊",
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 16),

            // 감정 패턴
            Card(
              child: Padding(
                padding: const EdgeInsets.all(16),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    const Text("최근 감정 패턴", style: TextStyle(fontWeight: FontWeight.bold)),
                    const SizedBox(height: 12),
                    SizedBox(
                      height: 140,
                      child: buildBarChart(),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      "최근 일주일 간 감정이 점점 좋아지고 있어요! 어제와 오늘 특히 상승했네요! 💖",
                      style: TextStyle(fontSize: 13),
                    ),
                  ],
                ),
              ),
            ),
            const SizedBox(height: 24),

            // 공감 버튼
            ElevatedButton.icon(
              onPressed: liked ? null : handleLike,
              icon: const Icon(Icons.thumb_up),
              label: Text(liked ? "공감했어요!" : "공감해요"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                backgroundColor: liked ? Colors.grey : Colors.pinkAccent,
              ),
            )
          ],
        ),
      ),
    );
  }
}
