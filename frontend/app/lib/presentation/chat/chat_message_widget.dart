import 'package:flutter/material.dart';

import '../../domain/entry/chat.dart';
import 'chat_message_bubble.dart';

class ChatMessageWidget extends StatelessWidget {
  final Chat chat;

  const ChatMessageWidget({
    super.key,
    required this.chat,
  });

  @override
  Widget build(BuildContext context) {
    final isMine = chat.sender == 'USER';
    return Align(
      alignment: isMine ? Alignment.centerRight : Alignment.centerLeft,
      child: ChatMessageBubble(
        message: chat.message,
        isMine: isMine,
        sender: chat.sender,
        createdAt: chat.createdAt,
      ),
    );
  }
}
