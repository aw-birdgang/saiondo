import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:loading_animation_widget/loading_animation_widget.dart';

import '../../di/service_locator.dart';
import '../../domain/entry/user.dart';
import '../persona_profile/persona_profile_list.dart';
import '../persona_profile/store/persona_profile_store.dart';
import '../user/store/user_store.dart';

class MyPageScreen extends StatelessWidget {
  MyPageScreen({super.key});

  final userStore = getIt<UserStore>();
  final personaProfileStore = getIt<PersonaProfileStore>();

  void _goToLogin(BuildContext context) {
    if (ModalRoute.of(context)?.settings.name != '/login') {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  Future<void> _openPersonaProfile(BuildContext context, String userId) async {
    try {
      await personaProfileStore.loadProfiles(userId);
      if (context.mounted) {
        Navigator.push(
          context,
          MaterialPageRoute(
            builder: (_) => PersonaProfileListScreen(userId: userId),
          ),
        );
      }
    } catch (e) {
      if (context.mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('성향 프로필을 불러오지 못했습니다.')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Observer(
        builder: (_) {
          if (userStore.isLoading) {
            return Center(
              child: LoadingAnimationWidget.staggeredDotsWave(
                color: Colors.pink,
                size: 40,
              ),
            );
          }
          final user = userStore.selectedUser ?? (userStore.users.isNotEmpty ? userStore.users.first : null);
          final userId = user?.id;

          if (user == null || userId == null || userId.isEmpty) {
            Future.microtask(() => _goToLogin(context));
            return const Center(
              child: Text(
                '로그인 정보가 없습니다.\n다시 로그인 해주세요.',
                textAlign: TextAlign.center,
                style: TextStyle(fontSize: 16, color: Colors.grey),
              ),
            );
          }

          return MyPageContent(
            user: user,
            onPersonaProfileTap: () => _openPersonaProfile(context, userId),
          );
        },
      ),
    );
  }
}

class MyPageContent extends StatelessWidget {
  final User user;
  final VoidCallback onPersonaProfileTap;

  const MyPageContent({
    super.key,
    required this.user,
    required this.onPersonaProfileTap,
  });

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(20.0),
      child: Column(
        children: [
          // 프로필 카드
          Card(
            elevation: 4,
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
            child: Padding(
              padding: const EdgeInsets.symmetric(vertical: 24, horizontal: 16),
              child: Row(
                children: [
                  CircleAvatar(
                    radius: 32,
                    child: Icon(Icons.account_circle, size: 48, color: Colors.white),
                    backgroundColor: Colors.blueAccent,
                  ),
                  const SizedBox(width: 20),
                  Expanded(
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          user.name,
                          style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                        ),
                        const SizedBox(height: 6),
                        Text(
                          user.email,
                          style: const TextStyle(fontSize: 16, color: Colors.grey),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            ),
          ),
          const SizedBox(height: 32),
          // 섹션: 프로필 관리
          Align(
            alignment: Alignment.centerLeft,
            child: Text(
              '내 정보 관리',
              style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: Colors.blueGrey[700]),
            ),
          ),
          const SizedBox(height: 12),
          ListTile(
            leading: const Icon(Icons.person_search, color: Colors.blueAccent),
            title: const Text('내 성향 관리', style: TextStyle(fontWeight: FontWeight.w600)),
            subtitle: const Text('나의 성향(퍼소나) 프로필을 추가/수정/삭제할 수 있습니다.'),
            trailing: const Icon(Icons.arrow_forward_ios, size: 18, color: Colors.blueAccent),
            shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            onTap: onPersonaProfileTap,
            tileColor: Colors.blue[50],
            contentPadding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
          ),
          const Spacer(),
        ],
      ),
    );
  }
}