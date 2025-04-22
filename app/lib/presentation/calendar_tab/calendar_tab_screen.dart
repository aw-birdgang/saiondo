import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:intl/intl.dart';

import '../../di/service_locator.dart';
import '../../models/emotion_log.dart';
import 'store/calendar_tab_store.dart';

class CalendarTabScreen extends StatefulWidget {
  const CalendarTabScreen({super.key});

  @override
  State<CalendarTabScreen> createState() => _CalendarTabScreenState();
}

class _CalendarTabScreenState extends State<CalendarTabScreen> {
  late CalendarTabStore _store;

  @override
  void initState() {
    super.initState();
    _store = getIt<CalendarTabStore>();
    _store.init();
  }

  @override
  void dispose() {
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_store.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        return RefreshIndicator(
          onRefresh: _store.init,
          child: SingleChildScrollView(
            physics: const AlwaysScrollableScrollPhysics(),
            padding: const EdgeInsets.all(16),
            child: Column(
              children: [
                _buildMonthHeader(),
                const SizedBox(height: 12),
                _buildWeekHeader(),
                const SizedBox(height: 4),
                _buildCalendarGrid(),
                const SizedBox(height: 24),
                if (_store.selectedDate != null) _buildEmotionDetail(_store.selectedDate!),
              ],
            ),
          ),
        );
      },
    );
  }

  Widget _buildMonthHeader() {
    return Row(
      mainAxisAlignment: MainAxisAlignment.spaceBetween,
      children: [
        IconButton(
          icon: const Icon(Icons.chevron_left),
          onPressed: () => _store.changeMonth(-1),
        ),
        Text(
          "${_store.currentMonth.year}년 ${_store.currentMonth.month}월",
          style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
        ),
        IconButton(
          icon: const Icon(Icons.chevron_right),
          onPressed: () => _store.changeMonth(1),
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
                child: Center(
                  child: Text(d, style: const TextStyle(fontWeight: FontWeight.bold)),
                ),
              ))
          .toList(),
    );
  }

  Widget _buildCalendarGrid() {
    final firstDay = DateTime(_store.currentMonth.year, _store.currentMonth.month, 1);
    final lastDay = DateTime(_store.currentMonth.year, _store.currentMonth.month + 1, 0);
    final firstWeekday = firstDay.weekday % 7;
    final totalDays = lastDay.day;
    final totalCells = ((firstWeekday + totalDays) / 7).ceil() * 7;

    return GridView.builder(
      shrinkWrap: true,
      physics: const NeverScrollableScrollPhysics(),
      itemCount: totalCells,
      gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
        crossAxisCount: 7,
        crossAxisSpacing: 4,
        mainAxisSpacing: 4,
      ),
      itemBuilder: (context, index) {
        final day = index - firstWeekday + 1;
        if (day < 1 || day > totalDays) return const SizedBox.shrink();

        final date = DateTime(_store.currentMonth.year, _store.currentMonth.month, day);
        final key = _store.formatDate(date);
        final log = _store.emotionLogs[key];
        final isSelected = _store.selectedDate != null && 
            _store.isSameDate(date, _store.selectedDate!);

        return GestureDetector(
          onTap: () {
            _store.selectDate(date);
            _showScheduleDialog(date);
          },
          child: Container(
            decoration: BoxDecoration(
              color: isSelected
                  ? Colors.pinkAccent
                  : log != null
                      ? Colors.pink.shade50
                      : Colors.transparent,
              borderRadius: BorderRadius.circular(8),
              border: Border.all(
                color: isSelected
                    ? Colors.pinkAccent
                    : log != null
                        ? Colors.pink.shade100
                        : Colors.grey.shade300,
              ),
            ),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Text(
                  day.toString(),
                  style: TextStyle(
                    fontWeight: isSelected ? FontWeight.bold : FontWeight.normal,
                    color: isSelected ? Colors.white : Colors.black87,
                  ),
                ),
                if (log != null)
                  Text(
                    log.emoji,
                    style: const TextStyle(fontSize: 16),
                  ),
              ],
            ),
          ),
        );
      },
    );
  }

  void _showScheduleDialog(DateTime date) {
    final dateStr = _store.formatDate(date);
    final log = _store.emotionLogs[dateStr];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text(_store.formatDate(date)),
        content: log != null
            ? Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Row(
                    children: [
                      Text(log.emoji, style: const TextStyle(fontSize: 32)),
                      const SizedBox(width: 16),
                      Text("${log.temperature}°", style: const TextStyle(fontSize: 20)),
                    ],
                  ),
                  const SizedBox(height: 16),
                  Wrap(
                    spacing: 8,
                    children: log.tags
                        .map((tag) => Chip(
                              label: Text(tag),
                              backgroundColor: Colors.pink.shade50,
                            ))
                        .toList(),
                  ),
                  const SizedBox(height: 16),
                  const Text("메모", style: TextStyle(fontWeight: FontWeight.bold)),
                  const SizedBox(height: 4),
                  Text(log.note.isNotEmpty ? log.note : "메모가 없습니다"),
                ],
              )
            : const Text("이 날의 감정 기록이 없습니다"),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("닫기"),
          ),
          TextButton(
            onPressed: () {
              Navigator.pop(context);
              _showAddEmotionDialog(date, log);
            },
            child: Text(log != null ? "수정" : "추가"),
          ),
        ],
      ),
    );
  }

  void _showAddEmotionDialog(DateTime date, EmotionLog? existingLog) {
    final dateStr = _store.formatDate(date);
    String selectedEmoji = existingLog?.emoji ?? '😊';
    int selectedTemp = existingLog?.temperature ?? 50;
    TextEditingController noteController = TextEditingController(text: existingLog?.note ?? '');
    List<String> selectedTags = List.from(existingLog?.tags ?? []);
    final availableTags = ['행복', '기쁨', '설렘', '만족', '평온', '지루함', '슬픔', '화남', '불안', '피곤'];

    showDialog(
      context: context,
      builder: (context) => AlertDialog(
        title: Text("${dateStr} 감정 기록"),
        content: SingleChildScrollView(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Row(
                children: ['😊', '😍', '😌', '😐', '😢', '😡', '😱']
                    .map((emoji) => Padding(
                          padding: const EdgeInsets.all(4),
                          child: CircleAvatar(
                            backgroundColor: selectedEmoji == emoji
                                ? Colors.pink.shade100
                                : Colors.transparent,
                            child: TextButton(
                              child: Text(emoji, style: const TextStyle(fontSize: 20)),
                              onPressed: () {
                                Navigator.pop(context);
                                _showAddEmotionDialog(
                                  date,
                                  existingLog != null
                                      ? EmotionLog(
                                          id: existingLog.id,
                                          date: existingLog.date,
                                          emoji: emoji,
                                          temperature: selectedTemp,
                                          tags: selectedTags,
                                          note: noteController.text,
                                          events: existingLog.events,
                                          createdAt: existingLog.createdAt,
                                          userId: existingLog.userId,
                                        )
                                      : null,
                                );
                              },
                            ),
                          ),
                        ))
                    .toList(),
              ),
              const SizedBox(height: 16),
              Row(
                children: [
                  const Text("온도: "),
                  Expanded(
                    child: Slider(
                      value: selectedTemp.toDouble(),
                      min: 0,
                      max: 100,
                      divisions: 10,
                      label: selectedTemp.toString(),
                      onChanged: (value) {
                        Navigator.pop(context);
                        _showAddEmotionDialog(
                          date,
                          existingLog != null
                              ? EmotionLog(
                                  id: existingLog.id,
                                  date: existingLog.date,
                                  emoji: selectedEmoji,
                                  temperature: value.toInt(),
                                  tags: selectedTags,
                                  note: noteController.text,
                                  events: existingLog.events,
                                  createdAt: existingLog.createdAt,
                                  userId: existingLog.userId,
                                )
                              : null,
                        );
                      },
                    ),
                  ),
                  Text("$selectedTemp°"),
                ],
              ),
              const SizedBox(height: 16),
              const Text("감정 태그 선택"),
              Wrap(
                spacing: 4,
                children: availableTags
                    .map((tag) => FilterChip(
                          label: Text(tag),
                          selected: selectedTags.contains(tag),
                          onSelected: (selected) {
                            if (selected) {
                              selectedTags.add(tag);
                            } else {
                              selectedTags.remove(tag);
                            }
                            Navigator.pop(context);
                            _showAddEmotionDialog(
                              date,
                              existingLog != null
                                  ? EmotionLog(
                                      id: existingLog.id,
                                      date: existingLog.date,
                                      emoji: selectedEmoji,
                                      temperature: selectedTemp,
                                      tags: selectedTags,
                                      note: noteController.text,
                                      events: existingLog.events,
                                      createdAt: existingLog.createdAt,
                                      userId: existingLog.userId,
                                    )
                                  : null,
                            );
                          },
                        ))
                    .toList(),
              ),
              const SizedBox(height: 16),
              TextField(
                controller: noteController,
                decoration: const InputDecoration(
                  labelText: "메모",
                  border: OutlineInputBorder(),
                ),
                maxLines: 3,
              ),
            ],
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.pop(context),
            child: const Text("취소"),
          ),
          TextButton(
            onPressed: () {
              _saveEmotionLog(
                docId: existingLog?.id,
                date: dateStr,
                emoji: selectedEmoji,
                temperature: selectedTemp,
                tags: selectedTags,
                note: noteController.text,
              );
              Navigator.pop(context);
            },
            child: const Text("저장"),
          ),
        ],
      ),
    );
  }

  Future<void> _saveEmotionLog({
    String? docId,
    required String date,
    required String emoji,
    required int temperature,
    required List<String> tags,
    required String note,
  }) async {
    final success = await _store.saveEmotionLog(
      date: date,
      emoji: emoji,
      temperature: temperature,
      tags: tags,
      note: note,
      docId: docId,
    );

    if (!success) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text("감정 로그 저장에 실패했습니다.")),
      );
    }
  }

  Widget _buildEmotionDetail(DateTime date) {
    final dateStr = _store.formatDate(date);
    final log = _store.emotionLogs[dateStr];

    if (log == null) {
      return const SizedBox.shrink();
    }

    return Card(
      margin: const EdgeInsets.symmetric(horizontal: 0, vertical: 8),
      child: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              DateFormat('yyyy년 MM월 dd일').format(date),
              style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 12),
            Row(
              children: [
                CircleAvatar(
                  radius: 24,
                  backgroundColor: Colors.pink.shade50,
                  child: Text(log.emoji, style: const TextStyle(fontSize: 24)),
                ),
                const SizedBox(width: 16),
                Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text("감정 온도: ${log.temperature}°"),
                    const SizedBox(height: 4),
                    Wrap(
                      spacing: 4,
                      children: log.tags
                          .map((tag) => Chip(
                                label: Text(tag),
                                backgroundColor: Colors.pink.shade50,
                                padding: EdgeInsets.zero,
                                labelPadding: const EdgeInsets.symmetric(horizontal: 8),
                              ))
                          .toList(),
                    ),
                  ],
                ),
              ],
            ),
            if (log.note.isNotEmpty) ...[
              const SizedBox(height: 16),
              const Text("메모", style: TextStyle(fontWeight: FontWeight.bold)),
              const SizedBox(height: 4),
              Text(log.note),
            ],
            const SizedBox(height: 16),
            Row(
              mainAxisAlignment: MainAxisAlignment.end,
              children: [
                OutlinedButton(
                  onPressed: () => _showAddEmotionDialog(date, log),
                  child: const Text("수정"),
                ),
              ],
            ),
          ],
        ),
      ),
    );
  }
} 