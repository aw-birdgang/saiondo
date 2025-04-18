import 'package:flutter/material.dart';
import 'package:hive_flutter/hive_flutter.dart';
import 'package:intl/intl.dart';

import '../models/emotion_log.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _currentMonth = DateTime.now();
  DateTime? _selectedDate;

  Box<EmotionLog> logBox = Hive.box<EmotionLog>('emotionLogs');

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16),
        child: Column(
          children: [
            _buildMonthHeader(),
            const SizedBox(height: 12),
            _buildWeekHeader(),
            const SizedBox(height: 4),
            _buildCalendarGrid(),
            const SizedBox(height: 24),
            if (_selectedDate != null) _buildEmotionDetail(_selectedDate!),
          ],
        ),
      ),
    );
  }

  Widget _buildMonthHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () {
            setState(() {
              _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1);
              _selectedDate = null;
            });
          },
        ),
        Text(
          "${_currentMonth.year}년 ${_currentMonth.month}월",
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: () {
            setState(() {
              _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1);
              _selectedDate = null;
            });
          },
        ),
      ],
    );
  }

  Widget _buildWeekHeader() {
    const days = ['일', '월', '화', '수', '목', '금', '토'];
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceAround,
      children: days
          .map((d) => Expanded(
        child: Center(child: Text(d, style: const TextStyle(fontWeight: FontWeight.bold))),
      ))
          .toList(),
    );
  }

  Widget _buildCalendarGrid() {
    final firstDay = DateTime(_currentMonth.year, _currentMonth.month, 1);
    final lastDay = DateTime(_currentMonth.year, _currentMonth.month + 1, 0);
    final firstWeekday = firstDay.weekday % 7;
    final totalDays = lastDay.day;
    final totalCells = ((firstWeekday + totalDays) / 7).ceil() * 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: totalCells,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(crossAxisCount: 7, crossAxisSpacing: 4, mainAxisSpacing: 4),
      itemBuilder: (context, index) {
        final day = index - firstWeekday + 1;
        if (day < 1 || day > totalDays) return const SizedBox.shrink();

        final date = DateTime(_currentMonth.year, _currentMonth.month, day);
        final key = DateFormat('yyyy-MM-dd').format(date);
        final log = logBox.get(key);
        final isSelected = _selectedDate != null && _isSameDate(date, _selectedDate!);

        return GestureDetector(
          onTap: () {
            setState(() => _selectedDate = date);
            _showScheduleDialog(date);
          },
          child: Container(
            decoration: BoxDecoration(
              color: isSelected ? Colors.pinkAccent : log != null ? Colors.pink.shade50 : Colors.grey.shade100,
              borderRadius: BorderRadius.circular(12),
              border: Border.all(color: log != null ? Colors.pink : Colors.grey.shade300),
              boxShadow: isSelected ? [BoxShadow(color: Colors.pinkAccent.withOpacity(0.3), blurRadius: 6)] : [],
            ),
            alignment: Alignment.center,
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text("$day", style: TextStyle(color: isSelected ? Colors.white : Colors.black)),
                if (log?.emoji != null)
                  Text(log!.emoji, style: TextStyle(color: isSelected ? Colors.white : Colors.pinkAccent)),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildEmotionDetail(DateTime date) {
    final key = DateFormat('yyyy-MM-dd').format(date);
    final log = logBox.get(key);
    if (log == null) return const SizedBox();

    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Colors.pink.shade50,
        borderRadius: BorderRadius.circular(12),
        border: Border.all(color: Colors.pinkAccent),
      ),
      child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
        Text("${date.month}월 ${date.day}일 감정", style: const TextStyle(fontWeight: FontWeight.bold)),
        const SizedBox(height: 8),
        Text("이모지: ${log.emoji}"),
        Text("감정 온도: ${log.temperature}°"),
        const SizedBox(height: 8),
        Text("메모: ${log.note}"),
        if (log.events != null && log.events!.isNotEmpty) ...[
          const SizedBox(height: 12),
          const Text("📅 일정:", style: TextStyle(fontWeight: FontWeight.bold)),
          ...log.events!.map((e) => Text("- $e")),
        ],
      ]),
    );
  }

  void _showScheduleDialog(DateTime date) {
    final key = DateFormat('yyyy-MM-dd').format(date);
    EmotionLog? existing = logBox.get(key);
    final TextEditingController controller = TextEditingController();
    List<String> schedules = List<String>.from(existing?.events ?? []);

    showDialog(
      context: context,
      builder: (_) => StatefulBuilder(
        builder: (context, setDialogState) {
          return AlertDialog(
            title: Text("${date.month}월 ${date.day}일 일정 관리"),
            content: Column(
              mainAxisSize: MainAxisSize.min,
              children: [
                TextField(
                  controller: controller,
                  decoration: const InputDecoration(
                    hintText: "예: 데이트, 기념일 등",
                    labelText: "새 일정 추가",
                  ),
                ),
                const SizedBox(height: 12),
                ...schedules.map((e) => Row(
                  children: [
                    Expanded(child: Text(e)),
                    IconButton(
                      icon: const Icon(Icons.delete, color: Colors.redAccent),
                      onPressed: () {
                        setDialogState(() => schedules.remove(e));
                      },
                    ),
                  ],
                )),
              ],
            ),
            actions: [
              TextButton(onPressed: () => Navigator.pop(context), child: const Text("닫기")),
              TextButton(
                onPressed: () {
                  if (controller.text.trim().isEmpty) return;
                  setDialogState(() {
                    schedules.add(controller.text.trim());
                    controller.clear();
                  });
                },
                child: const Text("추가"),
              ),
              ElevatedButton(
                onPressed: () {
                  final updated = EmotionLog(
                    date: key,
                    emoji: existing?.emoji ?? "😐",
                    temperature: existing?.temperature ?? 50,
                    tags: existing?.tags ?? [],
                    note: existing?.note ?? "",
                    events: schedules,
                  );
                  logBox.put(key, updated);
                  setState(() {});
                  Navigator.pop(context);
                },
                child: const Text("저장"),
              )
            ],
          );
        },
      ),
    );
  }

  bool _isSameDate(DateTime a, DateTime b) {
    return a.year == b.year && a.month == b.month && a.day == b.day;
  }
}