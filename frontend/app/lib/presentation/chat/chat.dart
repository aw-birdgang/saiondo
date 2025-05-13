import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:google_fonts/google_fonts.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/chat/chat_history.dart';
import 'chat_message_bubble.dart';
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
    _initChat();
  }

  Future<void> _initChat() async {
    await _chatStore.loadMessages(widget.roomId);
    _scrollToBottom();
    chatWebSocket.connect(
      onConnect: _onSocketConnect,
      onReceiveMessage: _onSocketReceiveMessage,
      onError: _onSocketError,
      onDisconnect: _onSocketDisconnect,
    );
  }

  void _onSocketConnect() {
    print('[Socket.IO] onConnect');
  }

  void _onSocketReceiveMessage(dynamic msg) {
    print('[Socket.IO] Received: $msg');
    final aiChat = msg['aiChat'];
    if (aiChat != null) {
      _chatStore.addMessage(ChatHistory.fromJson(aiChat));
      _scrollToBottom();
    }
  }

  void _onSocketError(dynamic error) {
    print('[Socket.IO] Error: $error');
  }

  void _onSocketDisconnect() {
    print('[Socket.IO] Connection closed');
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          _scrollController.position.maxScrollExtent,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  void _onSendPressed(String text) {
    print('[Chat] Send pressed: $text');
    if (text.trim().isEmpty) return;
    final message = ChatHistory(
      id: '',
      userId: widget.userId,
      message: text,
      sender: 'USER',
      timestamp: DateTime.now(),
      roomId: widget.roomId,
    );
    _chatStore.addMessage(message);
    chatWebSocket.sendMessage(widget.userId, widget.roomId, text);
    _textController.clear();
    _scrollToBottom();
    print('[Chat] Message sent: $message');
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
    return Scaffold(
      backgroundColor: const Color(0xFFF6F8FC),
      appBar: _buildAppBar(),
      body: Observer(
        builder: (_) {
          final messages = _chatStore.messages.toList();
          if (messages.isEmpty) {
            return const Center(child: Text('메시지가 없습니다.'));
          }
          return Column(
            children: [
              Expanded(child: _buildMessageList(messages)),
              _buildMessageInput(),
            ],
          );
        },
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return AppBar(
      backgroundColor: const Color(0xFFF6F8FC),
      elevation: 0,
      title: Text(
        '사이온도 채팅',
        style: GoogleFonts.nunito(
          color: const Color(0xFF22223B),
          fontWeight: FontWeight.bold,
        ),
      ),
      iconTheme: const IconThemeData(color: Color(0xFF22223B)),
    );
  }

  Widget _buildMessageList(List<ChatHistory> messages) {
    return ListView.builder(
      controller: _scrollController,
      itemCount: messages.length,
      padding: const EdgeInsets.symmetric(vertical: 8),
      itemBuilder: (context, index) {
        final message = messages[index];
        return ChatMessageBubble(
          message: message.message,
          sender: message.sender ?? '',
          timestamp: message.timestamp,
        );
      },
    );
  }

  Widget _buildMessageInput() {
    return SafeArea(
      child: Container(
        margin: const EdgeInsets.symmetric(horizontal: 8, vertical: 8),
        decoration: BoxDecoration(
          color: const Color(0xFFF6F8FC),
          borderRadius: BorderRadius.circular(24),
          boxShadow: const [
            BoxShadow(
              color: Colors.black12,
              blurRadius: 8,
              offset: Offset(0, 2),
            ),
          ],
        ),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
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
                  contentPadding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                ),
                onSubmitted: _onSendPressed,
              ),
            ),
            const SizedBox(width: 8),
            Observer(
              builder: (_) => IconButton(
                icon: const Icon(Icons.send, color: Color(0xFF7EC8E3)),
                onPressed: _chatStore.isLoading
                    ? null
                    : () => _onSendPressed(_textController.text.trim()),
              ),
            ),
          ],
        ),
      ),
    );
  }
}