import 'package:flutter/material.dart';

import '../models/emotion_log.dart';
import '../services/emotion_service.dart';

class EmotionScreen extends StatefulWidget {
  const EmotionScreen({super.key});

  @override
  State<EmotionScreen> createState() => _EmotionScreenState();
}

class _EmotionScreenState extends State<EmotionScreen> {
  double temperature = 50;
  String? selectedEmoji;
  final List<String> selectedTags = [];
  final TextEditingController emotionTextController = TextEditingController();
  bool isSaving = false;

  final List<String> emojis = ["😄", "🙂", "😐", "😢", "😠", "😴", "😰", "🥰", "😎", "🤔"];
  final List<String> emotionTags = ["행복", "만족", "평온", "지루함", "불안", "슬픔", "화남", "설렘", "기대", "걱정"];

  void toggleTag(String tag) {
    setState(() {
      if (selectedTags.contains(tag)) {
        selectedTags.remove(tag);
      } else {
        selectedTags.add(tag);
      }
    });
  }

  Future<void> submitEmotion() async {
    if (selectedEmoji == null || selectedTags.isEmpty || emotionTextController.text.trim().isEmpty) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("모든 항목을 입력해 주세요!")),
      );
      return;
    }

    setState(() => isSaving = true);

    final log = EmotionLog(
      date: DateTime.now().toIso8601String().split("T")[0], // yyyy-MM-dd
      emoji: selectedEmoji!,
      temperature: temperature.round(),
      tags: selectedTags,
      note: emotionTextController.text.trim(),
    );

    await EmotionService.saveLog(log);

    setState(() => isSaving = false);

    if (!mounted) return;
    Navigator.pushReplacementNamed(context, "/feedback");
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("오늘의 감정 입력"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            const Text("감정 온도", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                const Text("차가움"),
                Text("${temperature.round()}°", style: const TextStyle(fontWeight: FontWeight.bold)),
                const Text("뜨거움"),
              ],
            ),
            Slider(
              value: temperature,
              onChanged: (val) => setState(() => temperature = val),
              min: 0,
              max: 100,
            ),
            const SizedBox(height: 16),

            const Text("감정 이모지", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 12,
              runSpacing: 12,
              children: emojis.map((emoji) {
                final isSelected = emoji == selectedEmoji;
                return GestureDetector(
                  onTap: () => setState(() => selectedEmoji = emoji),
                  child: AnimatedScale(
                    scale: isSelected ? 1.3 : 1.0,
                    duration: const Duration(milliseconds: 200),
                    child: CircleAvatar(
                      radius: 24,
                      backgroundColor: isSelected ? Colors.pinkAccent.withOpacity(0.2) : Colors.grey.shade100,
                      child: Text(emoji, style: const TextStyle(fontSize: 24)),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            const Text("감정 태그", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            Wrap(
              spacing: 8,
              runSpacing: 8,
              children: emotionTags.map((tag) {
                final isSelected = selectedTags.contains(tag);
                return GestureDetector(
                  onTap: () => toggleTag(tag),
                  child: Container(
                    padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                    decoration: BoxDecoration(
                      color: isSelected ? Colors.pinkAccent : Colors.grey.shade300,
                      borderRadius: BorderRadius.circular(20),
                    ),
                    child: Text(
                      tag,
                      style: TextStyle(
                        color: isSelected ? Colors.white : Colors.black87,
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
            const SizedBox(height: 24),

            const Text("감정 기록", style: TextStyle(fontWeight: FontWeight.bold)),
            const SizedBox(height: 8),
            TextField(
              controller: emotionTextController,
              minLines: 4,
              maxLines: 8,
              decoration: InputDecoration(
                hintText: "오늘 있었던 일이나 감정을 자유롭게 적어보세요...",
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                ),
              ),
            ),
            const SizedBox(height: 24),

            ElevatedButton.icon(
              onPressed: isSaving ? null : submitEmotion,
              icon: const Icon(Icons.send),
              label: Text(isSaving ? "저장 중..." : "감정 저장하기"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                backgroundColor: Colors.pinkAccent,
              ),
            ),
          ],
        ),
      ),
    );
  }
}
