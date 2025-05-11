import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:get_it/get_it.dart';
import 'package:google_fonts/google_fonts.dart';

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
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: AppBar(
        backgroundColor: const Color(0xFFF6F8FC),
        elevation: 0,
        title: Text(
          '사이온도 채팅',
          style: GoogleFonts.nunito(
            color: Color(0xFF22223B),
            fontWeight: FontWeight.bold,
          ),
        ),
        iconTheme: IconThemeData(color: Color(0xFF22223B)),
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
                      mainAxisAlignment: isMe
                          ? MainAxisAlignment.end
                          : MainAxisAlignment.start,
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
        margin: EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        decoration: BoxDecoration(
          color: Color(0xFFF6F8FC),
          borderRadius: BorderRadius.circular(24),
          boxShadow: [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        padding: EdgeInsets.symmetric(horizontal: 12, vertical: 6),
        child: Row(
          children: [
            Expanded(
              child: TextField(
                controller: _textController,
                style: GoogleFonts.nunito(fontSize: 16),
                decoration: InputDecoration(
                  hintText: '메시지 입력...',
                  hintStyle: GoogleFonts.nunito(color: Colors.grey[500]),
                  border: InputBorder.none,
                  contentPadding: EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
                onSubmitted: (_) => _sendMessage(),
              ),
            ),
            SizedBox(width: 8),
            Observer(
              builder: (_) => IconButton(
                icon: Icon(Icons.send, color: Color(0xFF7EC8E3)),
                onPressed: _chatStore.isLoading ? null : _sendMessage,
              ),
            ),
          ],
        ),
      ),
    );
  }
}