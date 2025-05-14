import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import '../../di/service_locator.dart';
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
    if (_userStore.selectedUser == null) {
      _userStore.initUser?.call();
    }
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_userStore.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }
        final user = _userStore.selectedUser;
        return Scaffold(
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
              ElevatedButton.icon(
                icon: const Icon(Icons.chat),
                label: const Text('채팅 시작'),
                onPressed: () {
                  var roomId = _userStore.roomId;
                  var userId = _userStore.userId;
                  if (userId == null || roomId == null) {
                    return;
                  }
                  print('userId :: $userId, roomId :: $roomId');
                  Navigator.pushNamed(
                    context,
                    Routes.chat,
                    arguments: {
                      'userId': userId,
                      'roomId': roomId,
                    },
                  );
                },
              ),
            ],
          ),
        );
      },
    );
  }
}