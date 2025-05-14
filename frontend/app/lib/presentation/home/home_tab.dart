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
        return Scaffold(
          body: user == null
              ? const Center(child: Text('유저 정보를 불러올 수 없습니다.'))
              : Padding(
                  padding: const EdgeInsets.all(16),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        '환영합니다, ${user.name}님!',
                        style: const TextStyle(fontSize: 22, fontWeight: FontWeight.bold),
                      ),
                      const SizedBox(height: 24),
                      // 다른 위젯이 있다면 여기에 추가
                      // Spacer()는 아래 버튼을 하단에 붙이기 위해 사용하지 않음 (bottomNavigationBar 사용)
                    ],
                  ),
                ),
          bottomNavigationBar: user == null
              ? null
              : SafeArea(
                  child: Padding(
                    padding: const EdgeInsets.fromLTRB(16, 0, 16, 16),
                    child: SizedBox(
                      width: double.infinity,
                      height: 56,
                      child: ElevatedButton.icon(
                        icon: const Icon(Icons.chat),
                        label: const Text('채팅 시작', style: TextStyle(fontSize: 18)),
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
                        style: ElevatedButton.styleFrom(
                          padding: const EdgeInsets.symmetric(vertical: 14),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                      ),
                    ),
                  ),
                ),
        );
      },
    );
  }
}