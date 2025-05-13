import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import '../persona_profile/persona_profile_list.dart';
import '../persona_profile/store/persona_profile_store.dart';
import '../user/store/user_store.dart';

class MyPageScreen extends StatelessWidget {
  MyPageScreen({super.key});

  final userStore = getIt<UserStore>();
  final personaProfileStore = getIt<PersonaProfileStore>();

  void _goToLogin(BuildContext context) {
    // 이미 로그인 화면이면 중복 이동 방지
    if (ModalRoute.of(context)?.settings.name != '/login') {
      Navigator.pushReplacementNamed(context, '/login');
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('마이 페이지')),
      body: Observer(
        builder: (_) {
          if (userStore.isLoading) {
            return const Center(child: CircularProgressIndicator());
          }

          final user = userStore.selectedUser ?? (userStore.users.isNotEmpty ? userStore.users.first : null);
          final userId = user?.id;

          if (user == null || userId == null || userId.isEmpty) {
            // 유저 정보가 없거나 userId가 잘못된 경우
            print('[MyPageScreen] 유저 정보 없음 또는 userId가 잘못됨. 로그인 화면으로 이동');
            //Future.microtask(() => _goToLogin(context));
            return const Center(child: Text('로그인 정보가 없습니다. 다시 로그인 해주세요.'));
          }

          return ListView(
            children: [
              ListTile(
                leading: const Icon(Icons.account_circle),
                title: Text(user.name),
                subtitle: Text(user.email),
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.person_search),
                title: const Text('내 성향 관리'),
                subtitle: const Text('나의 성향(퍼소나) 프로필을 추가/수정/삭제할 수 있습니다.'),
                onTap: () async {
                  print('[MyPageScreen] 프로필 목록 로딩 시도: userId=$userId');
                  try {
                    await personaProfileStore.loadProfiles(userId);
                    if (context.mounted) {
                      Navigator.push(
                        context,
                        MaterialPageRoute(
                          builder: (_) => PersonaProfileListScreen(
                            userId: userId,
                          ),
                        ),
                      );
                    }
                  } catch (e) {
                    print('[MyPageScreen] 프로필 목록 로딩 실패: $e');
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('성향 프로필을 불러오지 못했습니다.')),
                    );
                  }
                },
              ),
              const Divider(),
              ListTile(
                leading: const Icon(Icons.logout),
                title: const Text('로그아웃'),
                onTap: () async {
                  await userStore.removeUser();
                  if (context.mounted) {
                    _goToLogin(context);
                  }
                },
              ),
            ],
          );
        },
      ),
    );
  }
}