import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import '../../di/service_locator.dart';
import 'store/chat_store.dart';
import '../../../domain/entry/chat/chat_history.dart';
import 'chat_message_widget.dart';


class ChatScreen extends StatefulWidget {
  final String userId;
  final String assistantId;
  final String channelId;

  const ChatScreen({
    super.key,
    required this.userId,
    required this.assistantId,
    required this.channelId,
  });

  @override
  State<ChatScreen> createState() => _ChatScreenState();
}

class _ChatScreenState extends State<ChatScreen> {
  late final ChatStore _chatStore = getIt<ChatStore>();
  final TextEditingController _controller = TextEditingController();

  @override
  void initState() {
    super.initState();
    _chatStore.connect(widget.userId, widget.assistantId, widget.channelId);
    _chatStore.loadMessages(widget.assistantId);
  }

  @override
  void dispose() {
    _chatStore.disconnect();
    _controller.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Observer(
          builder: (_) => Text(
            _chatStore.isConnected ? '채팅 (연결됨)' : '채팅 (연결끊김)',
          ),
        ),
      ),
      body: Column(
        children: [
          Expanded(
            child: Observer(
              builder: (_) => ListView.builder(
                reverse: true,
                padding: const EdgeInsets.symmetric(vertical: 12),
                itemCount: _chatStore.messages.length,
                itemBuilder: (context, index) {
                  // 최신 메시지가 아래로 오도록 역순
                  final reversedIndex = _chatStore.messages.length - 1 - index;
                  final ChatHistory msg = _chatStore.messages[reversedIndex];
                  return ChatMessageWidget(chat: msg);
                },
              ),
            ),
          ),
          _ChatInputBar(
            controller: _controller,
            onSend: (text) {
              _chatStore.sendMessage(text);
              _controller.clear();
            },
          ),
        ],
      ),
    );
  }
}

class _ChatInputBar extends StatelessWidget {
  final TextEditingController controller;
  final void Function(String) onSend;

  const _ChatInputBar({
    super.key,
    required this.controller,
    required this.onSend,
  });

  @override
  Widget build(BuildContext context) {
    return SafeArea(
      child: Row(
        children: [
          Expanded(
            child: Padding(
              padding: const EdgeInsets.symmetric(horizontal: 8.0),
              child: TextField(
                controller: controller,
                decoration: const InputDecoration(
                  hintText: '메시지를 입력하세요',
                ),
                onSubmitted: (text) {
                  if (text.trim().isNotEmpty) {
                    onSend(text.trim());
                  }
                },
              ),
            ),
          ),
          IconButton(
            icon: const Icon(Icons.send),
            onPressed: () {
              if (controller.text.trim().isNotEmpty) {
                onSend(controller.text.trim());
              }
            },
          ),
        ],
      ),
    );
  }
}