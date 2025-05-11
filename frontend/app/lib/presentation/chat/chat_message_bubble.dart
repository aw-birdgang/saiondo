import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
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
    final isAI = message.sender == 'AI';
    final bubbleColor = isMe
        ? const Color(0xFF7EC8E3) // 내 메시지: 파스텔 블루
        : (isAI
            ? const Color(0xFFF3E8FF) // AI: 연보라
            : Colors.white); // 상대: 화이트

    final textColor = isMe ? Colors.white : const Color(0xFF22223B);

    final align = isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start;
    final radius = isMe
        ? const BorderRadius.only(
            topLeft: Radius.circular(18),
            topRight: Radius.circular(18),
            bottomLeft: Radius.circular(18),
          )
        : const BorderRadius.only(
            topLeft: Radius.circular(18),
            topRight: Radius.circular(18),
            bottomRight: Radius.circular(18),
          );

    Widget bubble = Container(
      margin: EdgeInsets.symmetric(vertical: 4, horizontal: 10),
      padding: EdgeInsets.symmetric(vertical: 12, horizontal: 16),
      decoration: BoxDecoration(
        color: bubbleColor,
        borderRadius: radius,
        boxShadow: [
          BoxShadow(
            color: Colors.black12,
            blurRadius: 4,
            offset: Offset(0, 2),
          ),
        ],
      ),
      child: Text(
        message.message,
        style: GoogleFonts.nunito(
          fontSize: 16,
          color: textColor,
          fontWeight: FontWeight.w500,
        ),
      ),
    );

    // AI 메시지면 로봇 아이콘 + 말풍선 Row로 배치
    if (isAI) {
      bubble = Row(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.end,
        children: [
          Padding(
            padding: const EdgeInsets.only(right: 4.0, bottom: 2),
            child: Icon(Icons.smart_toy, color: Color(0xFFB388FF), size: 20),
          ),
          bubble,
        ],
      );
    }

    return Column(
      crossAxisAlignment: align,
      children: [
        bubble,
        Padding(
          padding: EdgeInsets.only(
            left: isMe ? 0 : 16,
            right: isMe ? 16 : 0,
            bottom: 2,
          ),
          child: Text(
            _formatTime(message.timestamp),
            style: GoogleFonts.nunito(
              fontSize: 11,
              color: Colors.grey[500],
            ),
          ),
        ),
      ],
    );
  }

  String _formatTime(DateTime dt) {
    return "${dt.hour.toString().padLeft(2, '0')}:${dt.minute.toString().padLeft(2, '0')}";
  }
}
