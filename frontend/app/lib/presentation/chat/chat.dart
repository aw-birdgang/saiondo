import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../core/widgets/lovely_chat_input_bar.dart';
import '../../core/widgets/lovely_loading_indicator.dart';
import '../../di/service_locator.dart';
import '../../domain/entry/chat.dart';
import '../../utils/locale/app_localization.dart';
import '../theme/app_colors.dart';
import '../theme/app_text_styles.dart';
import 'chat_message_widget.dart';
import 'store/chat_store.dart';

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
      backgroundColor: AppColors.background,
      resizeToAvoidBottomInset: true,
      appBar: AppBar(
        backgroundColor: AppColors.backgroundLight,
        elevation: 0,
        title: Observer(
          builder: (_) => Row(
            children: [
              AnimatedSwitcher(
                duration: const Duration(milliseconds: 300),
                child: Icon(
                  _chatStore.isConnected ? Icons.favorite : Icons.favorite_border,
                  color: _chatStore.isConnected ? AppColors.shadow : AppColors.grey,
                  size: 22,
                  key: ValueKey(_chatStore.isConnected),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                _chatStore.isConnected
                  ? (local?.translate('chat_connected') ?? '채팅 (연결됨)')
                  : (local?.translate('chat_disconnected') ?? '채팅 (연결끊김)'),
                style: AppTextStyles.sectionTitle.copyWith(color: AppColors.heartAccent),
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
                    final Chat msg = _chatStore.messages[reversedIndex];
                    return ChatMessageWidget(chat: msg);
                  },
                );
              },
            ),
          ),
          Observer(
            builder: (_) => _chatStore.isAwaitingLLM
                ? const LovelyLoadingIndicator()
                : const SizedBox.shrink(),
          ),
          LovelyChatInputBar(
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