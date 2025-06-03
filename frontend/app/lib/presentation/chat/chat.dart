import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import '../../di/service_locator.dart';
import '../../domain/entry/chat_history.dart';
import '../../utils/locale/app_localization.dart';
import 'store/chat_store.dart';
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
  final ScrollController _scrollController = ScrollController();

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
    _scrollController.dispose();
    super.dispose();
  }

  void _scrollToBottom() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (_scrollController.hasClients) {
        _scrollController.animateTo(
          0.0,
          duration: const Duration(milliseconds: 300),
          curve: Curves.easeOut,
        );
      }
    });
  }

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.pink[50],
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        backgroundColor: Colors.pink[100],
        elevation: 0,
        title: Observer(
          builder: (_) => Row(
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Icon(
                  _chatStore.isConnected ? Icons.favorite : Icons.favorite_border,
                  color: _chatStore.isConnected ? Colors.pinkAccent : Colors.grey,
                  size: 22,
                  key: ValueKey(_chatStore.isConnected),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _chatStore.isConnected
                  ? (local?.translate('chat_connected') ?? '채팅 (연결됨)')
                  : (local?.translate('chat_disconnected') ?? '채팅 (연결끊김)'),
                style: const TextStyle(
                  color: Color(0xFFD81B60),
                  fontWeight: FontWeight.bold,
                  fontFamily: 'Nunito',
                ),
              ),
            ],
          ),
        ),
        centerTitle: true,
      ),
      body: Column(
        children: [
          Expanded(
            child: Observer(
              builder: (_) {
                WidgetsBinding.instance.addPostFrameCallback((_) => _scrollToBottom());
                return ListView.builder(
                  controller: _scrollController,
                  reverse: true,
                  padding: const EdgeInsets.symmetric(vertical: 12, horizontal: 8),
                  itemCount: _chatStore.messages.length,
                  itemBuilder: (context, index) {
                    final reversedIndex = _chatStore.messages.length - 1 - index;
                    final ChatHistory msg = _chatStore.messages[reversedIndex];
                    return ChatMessageWidget(chat: msg);
                  },
                );
              },
            ),
          ),
          Observer(
            builder: (_) => _chatStore.isAwaitingLLM
                ? const _LovelyLoadingIndicator()
                : const SizedBox.shrink(),
          ),
          _LovelyChatInputBar(
            controller: _controller,
            onSend: (text) {
              _chatStore.sendMessage(text);
              _controller.clear();
              _scrollToBottom();
            },
            enabled: !_chatStore.isAwaitingLLM,
          ),
        ],
      ),
    );
  }
}

class _LovelyLoadingIndicator extends StatelessWidget {
  const _LovelyLoadingIndicator();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation<Color>(Colors.pinkAccent),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'AI가 답변을 작성 중입니다...',
              style: TextStyle(
                color: Colors.pink[400],
                fontWeight: FontWeight.w600,
                fontFamily: 'Nunito',
                fontSize: 15,
              ),
            ),
            const SizedBox(width: 8),
            const Text('💗', style: TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}

class _LovelyChatInputBar extends StatelessWidget {
  final TextEditingController controller;
  final void Function(String) onSend;
  final bool enabled;

  const _LovelyChatInputBar({
    super.key,
    required this.controller,
    required this.onSend,
    this.enabled = true,
  });

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return SafeArea(
      child: Container(
        color: Colors.transparent,
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
        child: Row(
          children: [
            Expanded(
              child: Container(
                decoration: BoxDecoration(
                  color: enabled ? Colors.white : Colors.grey[100],
                  borderRadius: BorderRadius.circular(24),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.pink.withOpacity(0.06),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: TextField(
                  controller: controller,
                  enabled: enabled,
                  minLines: 1,
                  maxLines: 4,
                  decoration: InputDecoration(
                    hintText: local?.translate('enter_message') ?? '메시지를 입력하세요',
                    hintStyle: const TextStyle(color: Colors.grey),
                    border: InputBorder.none,
                    contentPadding: const EdgeInsets.symmetric(horizontal: 18, vertical: 12),
                  ),
                  style: const TextStyle(fontFamily: 'Nunito'),
                  onSubmitted: (text) {
                    if (text.trim().isNotEmpty && enabled) {
                      onSend(text.trim());
                    }
                  },
                ),
              ),
            ),
            const SizedBox(width: 8),
            Container(
              decoration: BoxDecoration(
                color: enabled ? Colors.pinkAccent : Colors.grey,
                borderRadius: BorderRadius.circular(24),
                boxShadow: [
                  BoxShadow(
                    color: Colors.pink.withOpacity(0.12),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: IconButton(
                icon: const Icon(Icons.send_rounded, color: Colors.white),
                iconSize: 24,
                tooltip: local?.translate('send') ?? '전송',
                onPressed: enabled
                    ? () {
                        if (controller.text.trim().isNotEmpty) {
                          onSend(controller.text.trim());
                        }
                      }
                    : null,
              ),
            ),
          ],
        ),
      ),
    );
  }
}