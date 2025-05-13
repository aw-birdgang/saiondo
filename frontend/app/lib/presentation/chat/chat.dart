import 'dart:convert';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:intl/intl.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/chat/chat_history.dart';
import 'chat_websocket.dart';
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
  final ChatStore _chatStore = getIt<ChatStore>();
  final _scrollController = ScrollController();
  final ChatWebSocket chatWebSocket = ChatWebSocket();

  @override
  void initState() {
    super.initState();
    print('ChatScreen!!!!!!!!! initState!!!!!!!!!!!');

    _chatStore.loadMessages(widget.roomId).then((_) => _scrollToBottom());
    chatWebSocket.connect(
      onConnect: () {
        print('[Socket.IO] onConnect');
      },
      onReceiveMessage: (msg) {
        // msg는 서버에서 온 Map<String, dynamic>
        // userChat, aiChat 모두 있을 수 있음
        // if (msg['userChat'] != null) {
        //   _chatStore.addMessage(ChatHistory.fromJson(msg['userChat']));
        // }
        if (msg['aiChat'] != null) {
          _chatStore.addMessage(ChatHistory.fromJson(msg['aiChat']));
        }
        _scrollToBottom();
      },
      onError: (error) {
        print('[Socket.IO] Error: $error');
      },
      onDisconnect: () {
        print('[Socket.IO] Connection closed');
      },
    );
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

  void onSendPressed(String text) {
    if (text.trim().isEmpty) return;
    _chatStore.addMessage(ChatHistory(
      id: '',
      userId: widget.userId,
      message: text,
      sender: 'USER',
      timestamp: DateTime.now(),
      roomId: widget.roomId,
    ));
    chatWebSocket.sendMessage(widget.userId, widget.roomId, text);
    _textController.clear();
    _scrollToBottom();
  }

  @override
  void dispose() {
    chatWebSocket.disconnect();
    _textController.dispose();
    _scrollController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        final messages = _chatStore.messages.toList();
        if (messages.isEmpty) {
          return Center(child: Text('메시지가 없습니다.'));
        }
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
                child: ListView.builder(
                  controller: _scrollController,
                  itemCount: messages.length,
                  padding: EdgeInsets.symmetric(vertical: 8),
                  reverse: false,
                  itemBuilder: (context, index) {
                    final message = messages[index];
                    final isMe = (message.sender ?? '').toUpperCase() == 'USER';
                    return Align(
                      alignment: isMe ? Alignment.centerRight : Alignment.centerLeft,
                      child: Container(
                        margin: EdgeInsets.symmetric(vertical: 4, horizontal: 8),
                        padding: EdgeInsets.all(12),
                        decoration: BoxDecoration(
                          color: isMe ? Colors.blue[100] : Colors.grey[200],
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Column(
                          crossAxisAlignment: isMe ? CrossAxisAlignment.end : CrossAxisAlignment.start,
                          children: [
                            Text(
                              message.message,
                              style: TextStyle(fontSize: 16),
                            ),
                            SizedBox(height: 4),
                            Text(
                              DateFormat('HH:mm').format(message.timestamp),
                              style: TextStyle(fontSize: 12, color: Colors.grey[600]),
                            ),
                          ],
                        ),
                      ),
                    );
                  },
                ),
              ),
              _buildMessageInput(),
            ],
          ),
        );
      },
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
                onSubmitted: onSendPressed,
              ),
            ),
            SizedBox(width: 8),
            Observer(
              builder: (_) => IconButton(
                icon: Icon(Icons.send, color: Color(0xFF7EC8E3)),
                onPressed: _chatStore.isLoading ? null : () => onSendPressed(_textController.text.trim()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}