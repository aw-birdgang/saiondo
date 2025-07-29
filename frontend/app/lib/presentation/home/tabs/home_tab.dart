import 'package:flutter/material.dart';

import '../../../core/widgets/lovely_action_button.dart';
import '../../../di/service_locator.dart';
import '../../../utils/locale/app_localization.dart';
import '../../../utils/routes/routes.dart';
import '../../auth/auth_guard.dart';
import '../../user/store/user_store.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});
  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final _userStore = getIt<UserStore>();

  @override
  void initState() {
    super.initState();
    _userStore.initUser?.call();
  }

  @override
  Widget build(BuildContext context) {
    return AuthGuard(
      child: _buildHomeTabContent(context),
    );
  }

  Widget _buildHomeTabContent(BuildContext context) {
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
                    child: const Icon(Icons.psychology_alt,
                        size: 56, color: Colors.white),
                  ),
                  const SizedBox(height: 24),
                  Text(
                    local!.translate('ai_advice_bot'),
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
                  LovelyActionButton(
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
