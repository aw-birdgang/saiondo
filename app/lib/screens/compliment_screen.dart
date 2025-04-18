import 'package:flutter/material.dart';

class ComplimentScreen extends StatefulWidget {
  const ComplimentScreen({super.key});

  @override
  State<ComplimentScreen> createState() => _ComplimentScreenState();
}

class _ComplimentScreenState extends State<ComplimentScreen> {
  bool loading = true;
  bool sending = false;
  String? selectedCompliment;
  final TextEditingController customController = TextEditingController();
  bool useCustom = false;

  final List<String> compliments = [
    "오늘 당신의 미소가 내 하루를 밝게 만들었어요. 😊",
    "어려운 상황에서도 침착하게 대처하는 모습이 정말 멋져요!",
    "당신의 이해와 배려, 항상 고맙고 든든해요 💖",
  ];

  @override
  void initState() {
    super.initState();
    Future.delayed(const Duration(seconds: 1), () {
      setState(() => loading = false);
    });
  }

  void handleSend() {
    if (!useCustom && selectedCompliment == null) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("칭찬 문구를 선택하거나 직접 작성해주세요!")),
      );
      return;
    }

    if (useCustom && customController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("직접 입력한 문구가 비어있어요!")),
      );
      return;
    }

    setState(() => sending = true);

    Future.delayed(const Duration(seconds: 1), () {
      setState(() => sending = false);
      Navigator.pushReplacementNamed(context, "/home");
    });
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("하루 한 칭찬"),
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
            // 추천 칭찬 문구
            const Text("AI 추천 칭찬", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 12),
            Column(
              children: compliments.map((text) {
                final selected = selectedCompliment == text;
                return GestureDetector(
                  onTap: () {
                    setState(() {
                      selectedCompliment = text;
                      useCustom = false;
                      customController.clear();
                    });
                  },
                  child: Card(
                    color: selected ? Colors.pinkAccent.withOpacity(0.2) : null,
                    child: Padding(
                      padding: const EdgeInsets.all(12),
                      child: Row(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Icon(
                            selected ? Icons.check_circle : Icons.circle_outlined,
                            color: Colors.pinkAccent,
                          ),
                          const SizedBox(width: 8),
                          Expanded(child: Text(text)),
                        ],
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            // 직접 작성
            const Text("직접 작성하기", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: customController,
              maxLines: 4,
              decoration: InputDecoration(
                hintText: "상대방에게 전하고 싶은 칭찬을 적어보세요...",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
              onChanged: (val) {
                setState(() {
                  useCustom = val.trim().isNotEmpty;
                  if (useCustom) selectedCompliment = null;
                });
              },
            ),
            const SizedBox(height: 24),

            ElevatedButton.icon(
              onPressed: sending ? null : handleSend,
              icon: const Icon(Icons.send),
              label: Text(sending ? "전송 중..." : "칭찬 보내기"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                backgroundColor: Colors.pinkAccent,
              ),
            )
          ],
        ),
      ),
    );
  }
}
