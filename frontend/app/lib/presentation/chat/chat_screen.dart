import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:get_it/get_it.dart';
import 'store/chat_store.dart';
import 'chat_message_widget.dart';

class ChatScreen extends StatefulWidget {
  final String userId;
  final String roomId;

  const ChatScreen({
    required this.userId,
    required this.roomId,
    Key? key,
  }) : super(key: key);

  @override
  _ChatScreenState createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _textController = TextEditingController();
  final _chatStore = GetIt.I<ChatStore>();

  @override
  void initState() {
    super.initState();
    _chatStore.loadMessages(widget.roomId);
  }

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
    final text = _textController.text.trim();
    if (text.isNotEmpty) {
      _chatStore.sendMessage(widget.userId, widget.roomId, text);
      _textController.clear();
    }
  }
}