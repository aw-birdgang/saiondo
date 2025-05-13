import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import '../../di/service_locator.dart';
import '../user/store/user_store.dart';

class HomeTabScreen extends StatefulWidget {
  const HomeTabScreen({super.key});

  @override
  State<HomeTabScreen> createState() => _HomeTabScreenState();
}

class _HomeTabScreenState extends State<HomeTabScreen> {
  final userStore = getIt<UserStore>();

  @override
  void initState() {
    super.initState();
    // 앱 시작 시 유저 정보가 없으면 로딩 시도
    if (userStore.selectedUser == null) {
      userStore.initUser?.call(); // initUser가 있다면 호출, 없으면 생략
    }
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (userStore.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        final user = userStore.selectedUser;
        return Scaffold(
          appBar: AppBar(
            title: const Text('홈'),
          ),
          body: user == null
              ? const Center(child: Text('유저 정보를 불러올 수 없습니다.'))
              : ListView(
            padding: const EdgeInsets.all(16),
            children: [
              Text(
                '환영합니다, ${user.name}님!',
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
              ),
              const SizedBox(height: 24),
              Card(
                child: ListTile(
                  leading: const Icon(Icons.account_circle),
                  title: Text(user.name),
                  subtitle: Text(user.email),
                ),
              ),
              const SizedBox(height: 24),
              ElevatedButton.icon(
                icon: const Icon(Icons.chat),
                label: const Text('채팅 시작'),
                onPressed: () {
                  // 채팅방 이동 등 원하는 기능 구현
                  ScaffoldMessenger.of(context).showSnackBar(
                    const SnackBar(content: Text('채팅방으로 이동! (구현 필요)')),
                  );
                },
              ),
              const SizedBox(height: 12),
              ElevatedButton.icon(
                icon: const Icon(Icons.person_search),
                label: const Text('내 성향 관리 바로가기'),
                onPressed: () {
                  // 마이페이지 탭으로 이동
                  // (HomeScreen에서 _selectedIndex를 바꾸는 콜백을 전달받아야 함)
                  // 또는, 직접 PersonaProfileListScreen으로 이동
                },
              ),
            ],
          ),
        );
      },
    );
  }
}