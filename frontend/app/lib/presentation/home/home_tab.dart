import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user/user.dart';
import '../../utils/routes/routes.dart';
import '../user/store/user_store.dart';

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
    return Observer(
      builder: (_) {
        if (_userStore.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        final user = _userStore.selectedUser;
        if (user == null) {
          return const Center(child: Text('유저 정보를 불러올 수 없습니다.'));
        }
        return HomeTabContent(
          user: user,
          assistantId: _userStore.assistantId,
          channelId: _userStore.channelId,
          userId: _userStore.userId,
        );
      },
    );
  }
}

class HomeTabContent extends StatelessWidget {
  final User user;
  final String? assistantId;
  final String? channelId;
  final String? userId;

  const HomeTabContent({
    super.key,
    required this.user,
    required this.assistantId,
    required this.channelId,
    required this.userId,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Padding(
        padding: const EdgeInsets.all(16),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              '환영합니다, ${user.name}님!',
              style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 24),
          ],
        ),
      ),
      bottomNavigationBar: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
          child: SizedBox(
            width: double.infinity,
            height: 56,
            child: ElevatedButton.icon(
              icon: const Icon(Icons.chat),
              label: const Text('채팅 시작', style: TextStyle(fontSize: 18)),
              onPressed: (userId == null || assistantId == null || channelId == null)
                  ? null
                  : () {
                      print('채팅 버튼 클릭: userId=$userId, assistantId=$assistantId, channelId=$channelId');
                      Navigator.pushNamed(
                        context,
                        Routes.chat,
                        arguments: {
                          'userId': userId,
                          'assistantId': assistantId,
                          'channelId': channelId,
                        },
                      );
                    },
              style: ElevatedButton.styleFrom(
                padding: const EdgeInsets.symmetric(vertical: 14),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
            ),
          ),
        ),
      ),
    );
  }
}