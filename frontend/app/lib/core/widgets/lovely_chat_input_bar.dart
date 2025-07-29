import 'package:flutter/material.dart';

import '../../presentation/theme/app_colors.dart';
import '../../utils/locale/app_localization.dart';

class LovelyChatInputBar extends StatelessWidget {
  final TextEditingController controller;
  final void Function(String) onSend;
  final bool enabled;

  const LovelyChatInputBar({
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
                    contentPadding: const EdgeInsets.symmetric(
                        horizontal: 18, vertical: 12),
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
                color: enabled ? AppColors.shadow : Colors.grey,
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
