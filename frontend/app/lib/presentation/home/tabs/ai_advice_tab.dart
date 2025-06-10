import 'package:flutter/material.dart';

import '../../../di/service_locator.dart';
import '../../../utils/locale/app_localization.dart';
import '../../../utils/routes/routes.dart';
import '../../user/store/user_store.dart';

class AiAdviceTabScreen extends StatefulWidget {
  const AiAdviceTabScreen({super.key});

  @override
  State<AiAdviceTabScreen> createState() => _AiAdviceTabScreenState();
}

class _AiAdviceTabScreenState extends State<AiAdviceTabScreen> {
  final _userStore = getIt<UserStore>();

  @override
  void initState() {
    super.initState();
    _userStore.initUser?.call();
  }

  @override
  Widget build(BuildContext context) {
    final local = AppLocalizations.of(context);

    return Scaffold(
      backgroundColor: Colors.blue[50],
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 28.0, vertical: 32),
            child: Container(
              decoration: BoxDecoration(
                gradient: LinearGradient(
                  colors: [Colors.blue[100]!, Colors.pink[50]!],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(32),
                boxShadow: [
                  BoxShadow(
                    color: Colors.blue.withOpacity(0.08),
                    blurRadius: 16,
                    offset: const Offset(0, 8),
                  ),
                ],
              ),
              padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 36),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Container(
                    decoration: BoxDecoration(
                      shape: BoxShape.circle,
                      gradient: LinearGradient(
                        colors: [Colors.pinkAccent, Colors.blueAccent],
                        begin: Alignment.topLeft,
                        end: Alignment.bottomRight,
                      ),
                    ),
                    padding: const EdgeInsets.all(8),
                    child: const Icon(Icons.psychology_alt, size: 56, color: Colors.white),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    local.translate('ai_advice_bot'),
                    style: const TextStyle(
                      fontSize: 24,
                      fontWeight: FontWeight.bold,
                      color: Color(0xFF1976D2),
                      fontFamily: 'Nunito',
                    ),
                  ),
                  const SizedBox(height: 12),
                  Text(
                    local.translate('ai_advice_description'),
                    textAlign: TextAlign.center,
                    style: const TextStyle(
                      fontSize: 16,
                      color: Colors.black87,
                      fontFamily: 'Nunito',
                    ),
                  ),
                  const SizedBox(height: 36),
                  _LovelyActionButton(
                    icon: Icons.chat_bubble_rounded,
                    label: local.translate('start_ai_advice_chat'),
                    color: Colors.pinkAccent,
                    onPressed: () {
                      Navigator.pushNamed(
                        context,
                        Routes.chat,
                        arguments: {
                          'userId': _userStore.userId,
                          'assistantId': _userStore.assistantId,
                          'channelId': _userStore.channelId,
                        },
                      );
                    },
                  ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}

// 러블리한 액션 버튼
class _LovelyActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onPressed;

  const _LovelyActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Icon(icon, size: 22, color: Colors.white),
      label: Padding(
        padding: const EdgeInsets.symmetric(vertical: 2.0),
        child: Text(
          label,
          style: const TextStyle(
            fontWeight: FontWeight.bold,
            fontSize: 16,
            fontFamily: 'Nunito',
            color: Colors.white,
          ),
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 4,
        shadowColor: color.withOpacity(0.2),
      ),
      onPressed: onPressed,
    );
  }
}
