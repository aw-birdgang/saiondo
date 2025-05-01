import 'package:app/presentation/chat/store/chat_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:get_it/get_it.dart';

import 'chat_message_widget.dart';

class ChatScreen extends StatefulWidget {
  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _textController = TextEditingController();
  final _chatStore = GetIt.I<ChatStore>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('Chat'),
      ),
      body: Column(
        children: [
          Expanded(
            child: Observer(
              builder: (_) => ListView.builder(
                reverse: true,
                itemCount: _chatStore.messages.length,
                itemBuilder: (context, index) {
                  final message = _chatStore.messages[index];
                  return ChatMessageWidget(message: message);
                },
              ),
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return Container(
      padding: EdgeInsets.all(8.0),
      child: Row(
        children: [
          Expanded(
            child: TextField(
              controller: _textController,
              decoration: InputDecoration(
                hintText: 'Type a message...',
                border: OutlineInputBorder(),
              ),
            ),
          ),
          SizedBox(width: 8),
          Observer(
            builder: (_) => IconButton(
              icon: Icon(Icons.send),
              onPressed: _chatStore.isLoading
                  ? null
                  : () => _sendMessage(),
            ),
          ),
        ],
      ),
    );
  }

  void _sendMessage() {
    if (_textController.text.trim().isEmpty) return;
    _chatStore.sendMessage(_textController.text);
    _textController.clear();
  }
}