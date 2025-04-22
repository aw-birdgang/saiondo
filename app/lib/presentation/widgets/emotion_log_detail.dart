import 'package:flutter/material.dart';

import '../../models/emotion_log.dart';

class EmotionLogDetail extends StatelessWidget {
  final EmotionLog log;

  const EmotionLogDetail({
    Key? key,
    required this.log,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(16),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          _buildHeader(),
          if (log.tags.isNotEmpty) ..._buildTags(),
          if (log.note.isNotEmpty) ..._buildNote(),
          if (log.events?.isNotEmpty ?? false) ..._buildEvents(),
        ],
      ),
    );
  }

  Widget _buildHeader() {
    return Row(
      children: [
        Text(
          log.emoji,
          style: const TextStyle(fontSize: 32),
        ),
        const SizedBox(width: 12),
        Expanded(
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                log.date,
                style: const TextStyle(
                  fontSize: 18,
                  fontWeight: FontWeight.bold,
                ),
              ),
              Text(
                "감정 온도: ${log.temperature}°",
                style: TextStyle(
                  color: Colors.grey.shade600,
                ),
              ),
            ],
          ),
        ),
      ],
    );
  }

  List<Widget> _buildTags() {
    return [
      const SizedBox(height: 16),
      const Text(
        "감정 태그",
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 8),
      Wrap(
        spacing: 8,
        runSpacing: 8,
        children: log.tags.map((tag) => Chip(
          label: Text(tag),
          backgroundColor: Colors.pink.shade50,
        )).toList(),
      ),
    ];
  }

  List<Widget> _buildNote() {
    return [
      const SizedBox(height: 16),
      const Text(
        "메모",
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 8),
      Text(log.note),
    ];
  }

  List<Widget> _buildEvents() {
    return [
      const SizedBox(height: 16),
      const Text(
        "이벤트",
        style: TextStyle(fontWeight: FontWeight.bold),
      ),
      const SizedBox(height: 8),
      ...log.events!.map((event) => Padding(
        padding: const EdgeInsets.only(bottom: 4),
        child: Row(
          children: [
            const Icon(Icons.event, size: 16),
            const SizedBox(width: 8),
            Text(event),
          ],
        ),
      )),
    ];
  }
}