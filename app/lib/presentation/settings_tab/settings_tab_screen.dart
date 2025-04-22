import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';

import '../../di/service_locator.dart';
import 'store/settings_tab_store.dart';

class SettingsTabScreen extends StatefulWidget {
  const SettingsTabScreen({super.key});

  @override
  State<SettingsTabScreen> createState() => _SettingsTabScreenState();
}

class _SettingsTabScreenState extends State<SettingsTabScreen> {
  late SettingsTabStore _store;

  @override
  void initState() {
    super.initState();
    _store = getIt<SettingsTabStore>();
    _store.init();
  }

  @override
  void dispose() {
    super.dispose();
  }

  void _showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  void _handleLogout() async {
    final success = await _store.logout();
    if (success) {
      _showSnack("로그아웃 되었습니다.");
      Future.delayed(const Duration(milliseconds: 500), () {
        Navigator.pushReplacementNamed(context, '/login');
      });
    } else {
      _showSnack("로그아웃 중 오류가 발생했습니다.");
    }
  }

  @override
  Widget build(BuildContext context) {
    return Observer(
      builder: (_) {
        if (_store.isLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        return SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: Column(
            children: [
              // 프로필 설정
              Card(
                child: ListTile(
                  leading: const Icon(Icons.person),
                  title: const Text("프로필 설정"),
                  subtitle: const Text("성향 정보 수정"),
                  trailing: TextButton(
                    onPressed: () => _showSnack("아직 준비 중이에요 🛠️"),
                    child: const Text("수정"),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // 계정 정보
              Card(
                child: ListTile(
                  leading: const Icon(Icons.lock),
                  title: const Text("계정 정보"),
                  subtitle: const Text("이메일, 비밀번호 변경"),
                  trailing: TextButton(
                    onPressed: () => _showSnack("준비 중!"),
                    child: const Text("수정"),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // 연애 상태 설정
              Card(
                child: ListTile(
                  leading: const Icon(Icons.favorite),
                  title: const Text("연애 상태"),
                  subtitle: Text("현재 상태: ${_store.relationshipStatus}"),
                  trailing: DropdownButton<String>(
                    value: _store.relationshipStatus,
                    items: _store.statusOptions.map((status) {
                      return DropdownMenuItem(
                        value: status,
                        child: Text(status),
                      );
                    }).toList(),
                    onChanged: (value) {
                      if (value != null) {
                        _store.setRelationshipStatus(value);
                      }
                    },
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // 기념일 설정
              Card(
                child: ListTile(
                  leading: const Icon(Icons.calendar_month),
                  title: const Text("기념일 관리"),
                  subtitle: const Text("중요한 날짜 설정"),
                  trailing: TextButton(
                    onPressed: () => _showSnack("기념일 기능도 곧 들어올게요 💌"),
                    child: const Text("관리"),
                  ),
                ),
              ),
              const SizedBox(height: 8),

              // 알림 설정
              SwitchListTile(
                title: const Text("감정 입력 알림"),
                subtitle: const Text("매일 감정 기록 알림 받기"),
                value: _store.notifications,
                onChanged: (_) => _store.toggleNotifications(),
                secondary: const Icon(Icons.notifications),
              ),
              const SizedBox(height: 4),

              // 다크 모드 설정
              SwitchListTile(
                title: const Text("다크 모드"),
                subtitle: const Text("어두운 테마로 전환"),
                value: _store.darkMode,
                onChanged: (_) => _store.toggleDarkMode(),
                secondary: const Icon(Icons.dark_mode),
              ),
              const SizedBox(height: 16),

              ElevatedButton.icon(
                onPressed: _handleLogout,
                icon: const Icon(Icons.logout),
                label: const Text("로그아웃"),
                style: ElevatedButton.styleFrom(
                  minimumSize: const Size.fromHeight(48),
                  backgroundColor: Colors.redAccent,
                ),
              ),
            ],
          ),
        );
      },
    );
  }
} 