import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

class ChatMessageBubble extends StatelessWidget {
  final String message;
  final bool isMine;
  final String sender;
  final DateTime timestamp;

  const ChatMessageBubble({
    super.key,
    required this.message,
    required this.isMine,
    required this.sender,
    required this.timestamp,
  });

  @override
  Widget build(BuildContext context) {
    final bubbleColor = isMine ? Colors.blue[200] : Colors.grey[300];
    final align = isMine ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final radius = isMine
        ? const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomLeft: Radius.circular(16),
          )
        : const BorderRadius.only(
            topLeft: Radius.circular(16),
            topRight: Radius.circular(16),
            bottomRight: Radius.circular(16),
          );

    return Column(
      crossAxisAlignment: align,
      children: [
        Padding(
          padding: EdgeInsets.only(
            left: isMine ? 40 : 8,
            right: isMine ? 8 : 40,
            top: 4,
            bottom: 2,
          ),
          child: Container(
            decoration: BoxDecoration(
              color: bubbleColor,
              borderRadius: radius,
            ),
            padding: const EdgeInsets.symmetric(vertical: 10, horizontal: 14),
            child: Text(
              message,
              style: TextStyle(
                color: Colors.black87,
                fontSize: 16,
              ),
            ),
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: isMine ? 40 : 12,
            right: isMine ? 12 : 40,
            bottom: 8,
          ),
          child: Text(
            '${isMine ? "나" : sender} · ${_formatTime(timestamp)}',
            style: TextStyle(
              color: Colors.grey[500],
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime time) {
    return "${time.hour.toString().padLeft(2, '0')}:${time.minute.toString().padLeft(2, '0')}";
  }
}

class _BubbleTailPainter extends CustomPainter {
  final bool isMe;
  final Color color;

  _BubbleTailPainter({required this.isMe, required this.color});

  @override
  void paint(Canvas canvas, Size size) {
    final paint = Paint()..color = color;
    final path = Path();
    if (isMe) {
      path.moveTo(0, 0);
      path.lineTo(size.width, size.height / 2);
      path.lineTo(0, size.height);
      path.close();
    } else {
      path.moveTo(size.width, 0);
      path.lineTo(0, size.height / 2);
      path.lineTo(size.width, size.height);
      path.close();
    }
    canvas.drawPath(path, paint);
  }

  @override
  bool shouldRepaint(covariant CustomPainter oldDelegate) => false;
}
