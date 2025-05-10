import 'package:flutter/material.dart';
import '../../domain/entry/chat/chat_history.dart';

class ChatMessageBubble extends StatelessWidget {
  final ChatHistory message;
  final bool isMe;

  const ChatMessageBubble({
    required this.message,
    required this.isMe,
    Key? key,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    final bubbleColor = isMe ? Colors.blue[200] : Colors.grey[300];
    final align = isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final radius = isMe
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
        Container(
          margin: EdgeInsets.symmetric(vertical: 2, horizontal: 8),
          padding: EdgeInsets.symmetric(vertical: 10, horizontal: 14),
          decoration: BoxDecoration(
            color: bubbleColor,
            borderRadius: radius,
          ),
          child: Text(
            message.message,
            style: TextStyle(fontSize: 16, color: Colors.black87),
          ),
        ),
        Padding(
          padding: EdgeInsets.only(
            left: isMe ? 0 : 12,
            right: isMe ? 12 : 0,
            bottom: 4,
          ),
          child: Text(
            _formatTime(message.timestamp),
            style: TextStyle(fontSize: 11, color: Colors.grey[600]),
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime dt) {
    return "${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}";
  }
}
