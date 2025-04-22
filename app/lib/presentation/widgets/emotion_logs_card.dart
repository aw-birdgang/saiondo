
import 'package:flutter/material.dart';

import '../../models/emotion_log.dart';
import 'emotion_log_detail.dart';

class EmotionLogCard extends StatelessWidget {
  final EmotionLog log;

  const EmotionLogCard({
    Key? key,
    required this.log,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Card(
      margin: const EdgeInsets.only(bottom: 8),
      child: ListTile(
        leading: _buildEmoji(),
        title: _buildTitle(),
        subtitle: _buildSubtitle(),
        onTap: () => _showDetail(context),
      ),
    );
  }

  Widget _buildEmoji() {
    return Container(
      width: 40,
      height: 40,
      decoration: BoxDecoration(
        color: Colors.pink.shade50,
        shape: BoxShape.circle,
      ),
      child: Center(
        child: Text(
          log.emoji,
          style: const TextStyle(fontSize: 20),
        ),
      ),
    );
  }

  Widget _buildTitle() {
    return Row(
      children: [
        Text(
          log.date,
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        const SizedBox(width: 8),
        Text(
          "${log.temperature}°",
          style: TextStyle(
            color: Colors.grey.shade600,
            fontSize: 14,
          ),
        ),
      ],
    );
  }

  Widget _buildSubtitle() {
    if (!log.tags.isNotEmpty) return const SizedBox.shrink();

    return Text(
      log.tags.join(', '),
      style: const TextStyle(fontSize: 13),
      maxLines: 1,
      overflow: TextOverflow.ellipsis,
    );
  }

  void _showDetail(BuildContext context) {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(16)),
      ),
      builder: (context) => EmotionLogDetail(log: log),
    );
  }
}