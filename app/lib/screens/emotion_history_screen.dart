import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';

import '../models/emotion_log.dart';
import '../services/emotion_service.dart';

class EmotionHistoryScreen extends StatefulWidget {
  const EmotionHistoryScreen({super.key});

  @override
  State<EmotionHistoryScreen> createState() => _EmotionHistoryScreenState();
}

class _EmotionHistoryScreenState extends State<EmotionHistoryScreen> {
  late Box<EmotionLog> logBox;

  final List<String> availableTags = [
    "행복", "만족", "피곤", "지루함", "설렘", "사랑", "불안", "감사", "스트레스"
  ];

  @override
  void initState() {
    super.initState();
    logBox = Hive.box<EmotionLog>('emotionLogs');
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text("감정 히스토리"),
        centerTitle: true,
        backgroundColor: Colors.pinkAccent,
        foregroundColor: Colors.white,
      ),
      body: ValueListenableBuilder(
        valueListenable: logBox.listenable(),
        builder: (context, Box<EmotionLog> box, _) {
          final logs = box.values.toList().reversed.toList();

          if (logs.isEmpty) {
            return const Center(child: Text("감정 기록이 없습니다."));
          }

          return ListView.separated(
            padding: const EdgeInsets.all(16),
            itemCount: logs.length,
            separatorBuilder: (_, __) => const SizedBox(height: 12),
            itemBuilder: (context, index) {
              final log = logs[index];
              final actualIndex = box.length - 1 - index;

              return Dismissible(
                key: ValueKey(log.key),
                direction: DismissDirection.endToStart,
                background: Container(
                  alignment: Alignment.centerRight,
                  padding: const EdgeInsets.symmetric(horizontal: 20),
                  color: Colors.redAccent,
                  child: const Icon(Icons.delete, color: Colors.white),
                ),
                onDismissed: (_) => EmotionService.deleteLog(actualIndex),
                child: GestureDetector(
                  onLongPress: () => _confirmDelete(actualIndex),
                  onTap: () => _showEditDialog(actualIndex, log),
                  child: _buildEmotionCard(log),
                ),
              );
            },
          );
        },
      ),
    );
  }

  Widget _buildEmotionCard(EmotionLog log) {
    return Card(
      elevation: 2,
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(log.date, style: const TextStyle(fontWeight: FontWeight.bold)),
              Row(
                children: [
                  Text(log.emoji, style: const TextStyle(fontSize: 20)),
                  const SizedBox(width: 8),
                  Text("${log.temperature}°", style: const TextStyle(fontSize: 14)),
                ],
              ),
            ],
          ),
          const SizedBox(height: 12),
          Wrap(
            spacing: 8,
            runSpacing: 4,
            children: log.tags.map((tag) {
              return Chip(
                label: Text(tag),
                backgroundColor: Colors.pink.shade50,
                labelStyle: const TextStyle(fontSize: 12),
              );
            }).toList(),
          ),
          const SizedBox(height: 8),
          Text(log.note, style: const TextStyle(fontSize: 13)),
        ]),
      ),
    );
  }

  void _confirmDelete(int index) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (_) => AlertDialog(
        title: const Text("삭제 확인"),
        content: const Text("이 감정 기록을 삭제하시겠어요?"),
        actions: [
          TextButton(onPressed: () => Navigator.pop(context, false), child: const Text("취소")),
          TextButton(
            onPressed: () => Navigator.pop(context, true),
            child: const Text("삭제", style: TextStyle(color: Colors.red)),
          ),
        ],
      ),
    );

    if (confirmed == true) {
      await EmotionService.deleteLog(index);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("감정 기록이 삭제되었습니다.")),
      );
    }
  }

  void _showEditDialog(int index, EmotionLog log) {
    final tempController = TextEditingController(text: log.temperature.toString());
    final noteController = TextEditingController(text: log.note);
    final selectedTags = List<String>.from(log.tags);
    String selectedEmoji = log.emoji;

    final emojis = ["😊", "😐", "😢", "😠", "😴", "🥰", "😎", "🤔", "🔥", "😭"];

    showDialog(
      context: context,
      builder: (context) {
        return AlertDialog(
          title: const Text("감정 기록 수정"),
          content: StatefulBuilder(
            builder: (context, setModalState) {
              return SingleChildScrollView(
                child: Column(
                  mainAxisSize: MainAxisSize.min,
                  children: [
                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text("감정 이모지 선택", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 8,
                      children: emojis.map((emoji) {
                        final isSelected = emoji == selectedEmoji;
                        return GestureDetector(
                          onTap: () {
                            setModalState(() {
                              selectedEmoji = emoji;
                            });
                          },
                          child: Container(
                            padding: const EdgeInsets.all(8),
                            decoration: BoxDecoration(
                              shape: BoxShape.circle,
                              color: isSelected ? Colors.pink.shade100 : Colors.grey.shade200,
                              border: Border.all(
                                color: isSelected ? Colors.pink : Colors.transparent,
                                width: 2,
                              ),
                            ),
                            child: Text(
                              emoji,
                              style: const TextStyle(fontSize: 24),
                            ),
                          ),
                        );
                      }).toList(),
                    ),
                    const SizedBox(height: 16),

                    TextField(
                      controller: tempController,
                      keyboardType: TextInputType.number,
                      decoration: const InputDecoration(labelText: "감정 온도 (0~100)"),
                    ),
                    const SizedBox(height: 12),

                    TextField(
                      controller: noteController,
                      maxLines: 3,
                      decoration: const InputDecoration(labelText: "메모"),
                    ),
                    const SizedBox(height: 12),

                    const Align(
                      alignment: Alignment.centerLeft,
                      child: Text("감정 태그 선택", style: TextStyle(fontWeight: FontWeight.bold)),
                    ),
                    const SizedBox(height: 8),
                    Wrap(
                      spacing: 8,
                      runSpacing: 4,
                      children: availableTags.map((tag) {
                        final isSelected = selectedTags.contains(tag);
                        return FilterChip(
                          label: Text(tag),
                          selected: isSelected,
                          onSelected: (val) {
                            setModalState(() {
                              if (val) {
                                selectedTags.add(tag);
                              } else {
                                selectedTags.remove(tag);
                              }
                            });
                          },
                          selectedColor: Colors.pink.shade100,
                        );
                      }).toList(),
                    ),
                  ],
                ),
              );
            },
          ),
          actions: [
            TextButton(onPressed: () => Navigator.pop(context), child: const Text("취소")),
            TextButton(
              onPressed: () async {
                final updatedLog = EmotionLog(
                  date: log.date,
                  emoji: selectedEmoji,
                  temperature: int.tryParse(tempController.text) ?? log.temperature,
                  tags: selectedTags,
                  note: noteController.text,
                );

                await EmotionService.updateLog(index, updatedLog);
                Navigator.pop(context);
              },
              child: const Text("저장", style: TextStyle(color: Colors.pink)),
            ),
          ],
        );
      },
    );
  }
}