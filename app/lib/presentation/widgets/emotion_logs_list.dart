import 'package:flutter/material.dart';

import '../../models/emotion_log.dart';
import 'emotion_logs_card.dart';
import 'empty_emotion.dart';

class EmotionLogsList extends StatelessWidget {
  final List<EmotionLog> logs;

  const EmotionLogsList({
    Key? key,
    required this.logs,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            "최근 감정 기록",
            style: TextStyle(fontWeight: FontWeight.bold, fontSize: 18),
          ),
          const SizedBox(height: 8),
          if (logs.isEmpty)
            const EmptyEmotionState()
          else
            ...logs.map((log) => EmotionLogCard(log: log)).toList(),
        ],
      ),
    );
  }
}