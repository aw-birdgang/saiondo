import 'package:flutter/material.dart';

class SettingsScreen extends StatefulWidget {
  const SettingsScreen({super.key});

  @override
  State<SettingsScreen> createState() => _SettingsScreenState();
}

class _SettingsScreenState extends State<SettingsScreen> {
  bool darkMode = false;
  bool notifications = true;
  String relationshipStatus = '연애 중';

  final List<String> statusOptions = ['연애 중', '약혼', '결혼', '잠시 휴식'];

  void handleLogout() {
    ScaffoldMessenger.of(context).showSnackBar(
      const SnackBar(content: Text("로그아웃 되었습니다.")),
    );
    Future.delayed(const Duration(milliseconds: 500), () {
      Navigator.pushReplacementNamed(context, '/login');
    });
  }

  void showSnack(String msg) {
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text(msg)));
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: SingleChildScrollView(
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
                  onPressed: () => showSnack("아직 준비 중이에요 🛠️"),
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
                  onPressed: () => showSnack("준비 중!"),
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
                subtitle: Text("현재 상태: $relationshipStatus"),
                trailing: DropdownButton<String>(
                  value: relationshipStatus,
                  items: statusOptions.map((status) {
                    return DropdownMenuItem(
                      value: status,
                      child: Text(status),
                    );
                  }).toList(),
                  onChanged: (value) {
                    setState(() {
                      relationshipStatus = value!;
                    });
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
                  onPressed: () => showSnack("기념일 기능도 곧 들어올게요 💌"),
                  child: const Text("관리"),
                ),
              ),
            ),
            const SizedBox(height: 8),

            // 알림 설정
            SwitchListTile(
              title: const Text("감정 입력 알림"),
              subtitle: const Text("매일 감정 기록 알림 받기"),
              value: notifications,
              onChanged: (val) {
                setState(() => notifications = val);
              },
              secondary: const Icon(Icons.notifications),
            ),
            const SizedBox(height: 4),

            // 다크 모드 설정
            SwitchListTile(
              title: const Text("다크 모드"),
              subtitle: const Text("어두운 테마로 전환"),
              value: darkMode,
              onChanged: (val) {
                setState(() => darkMode = val);
              },
              secondary: const Icon(Icons.dark_mode),
            ),
            const SizedBox(height: 16),

            ElevatedButton.icon(
              onPressed: handleLogout,
              icon: const Icon(Icons.logout),
              label: const Text("로그아웃"),
              style: ElevatedButton.styleFrom(
                minimumSize: const Size.fromHeight(48),
                backgroundColor: Colors.redAccent,
              ),
            )
          ],
        ),
      ),
    );
  }
}
