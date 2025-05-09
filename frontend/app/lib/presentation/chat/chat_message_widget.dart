import '../../domain/entry/chat/chat_history.dart';
import 'package:flutter/material.dart';

class ChatMessageWidget extends StatelessWidget {
  final ChatHistory message;
  const ChatMessageWidget({required this.message, super.key});

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(message.message),
      subtitle: Text('${message.sender} • ${message.timestamp}'),
    );
  }
}