import 'package:flutter/material.dart';

import '../../di/service_locator.dart';
import '../../utils/routes/routes.dart';
import '../user/store/user_store.dart';

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
    return Scaffold(
      backgroundColor: Colors.blue[50],
      body: SafeArea(
        child: Center(
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 32.0),
            child: Column(
              mainAxisAlignment: MainAxisAlignment.center,
              children: [
                Icon(Icons.psychology_alt, size: 64, color: Colors.blueAccent),
                SizedBox(height: 24),
                Text(
                  'AI 조언 챗봇',
                  style: TextStyle(fontSize: 24, fontWeight: FontWeight.bold, color: Colors.blueAccent),
                ),
                SizedBox(height: 12),
                Text(
                  'AI에게 연애 고민, 성향, 관계에 대한 조언을 받아보세요!',
                  textAlign: TextAlign.center,
                  style: TextStyle(fontSize: 16, color: Colors.black87),
                ),
                SizedBox(height: 32),
                ElevatedButton.icon(
                  icon: Icon(Icons.chat_bubble_outline),
                  label: Text('AI 조언 채팅 시작', style: TextStyle(fontSize: 18)),
                  style: ElevatedButton.styleFrom(
                    backgroundColor: Colors.blueAccent,
                    padding: EdgeInsets.symmetric(horizontal: 32, vertical: 16),
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                  ),
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
    );
  }
}
