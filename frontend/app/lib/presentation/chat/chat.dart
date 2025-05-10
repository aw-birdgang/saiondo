import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:get_it/get_it.dart';

import 'chat_message_bubble.dart';
import 'store/chat_store.dart';

class ChatScreen extends StatefulWidget {
  final String userId;
  final String roomId;

  const ChatScreen({
    required this.userId,
    required this.roomId,
    Key? key,
  }) : super(key: key);

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  final _textController = TextEditingController();
  final _chatStore = GetIt.I<ChatStore>();
  final _scrollController = ScrollController();

  @override
  void initState() {
    super.initState();
    _chatStore.loadMessages(widget.roomId).then((_) => _scrollToBottom());
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _sendMessage() async {
    final text = _textController.text.trim();
    if (text.isNotEmpty) {
      await _chatStore.sendMessage(widget.userId, widget.roomId, text);
      _textController.clear();
      _scrollToBottom();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text('채팅방'),
      ),
      body: Column(
        children: [
          Expanded(
            child: Observer(
              builder: (_) {
                final messages = _chatStore.messages.toList()
                  ..sort((a, b) => a.timestamp.compareTo(b.timestamp));
                return ListView.builder(
                  controller: _scrollController,
                  itemCount: messages.length,
                  padding: EdgeInsets.symmetric(vertical: 8),
                  reverse: false,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isMe = message.sender == 'USER';
                    return Row(
                      mainAxisAlignment:
                      isMe ? MainAxisAlignment.end : MainAxisAlignment.start,
                      children: [
                        Flexible(
                          child: ChatMessageBubble(
                            message: message,
                            isMe: isMe,
                          ),
                        ),
                      ],
                    );
                  },
                );
              },
            ),
          ),
          _buildMessageInput(),
        ],
      ),
    );
  }

  Widget _buildMessageInput() {
    return SafeArea(
      child: Container(
        padding: EdgeInsets.symmetric(horizontal: 8, vertical: 6),
        color: Colors.grey[100],
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                decoration: InputDecoration(
                  hintText: '메시지 입력...',
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(16),
                  ),
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
            SizedBox(width: 8),
            Observer(
              builder: (_) => IconButton(
                icon: Icon(Icons.send, color: Colors.blue),
                onPressed: _chatStore.isLoading ? null : _sendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }
}