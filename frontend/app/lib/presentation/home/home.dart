import 'package:app/presentation/home/store/home/home_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';

import '../../di/service_locator.dart';
import '../../utils/routes/routes.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final HomeStore _homeStore = getIt<HomeStore>();
  final logger = getIt<Logger>();

  final String myUserId = '949799da-b543-4cc9-a32a-57997c606393';
  String? selectedRoomId = "522c569b-5c33-4429-8d5e-8d37dc66db35";

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        backgroundColor: Colors.white,
        elevation: 0,
        title: Observer(
          builder: (_) => Text(
            _homeStore.title,
            style: const TextStyle(
              fontSize: 22,
              fontWeight: FontWeight.w700,
              color: Colors.black,
            ),
          ),
        ),
      ),
      body: Observer(
        builder: (_) {
          // 예시: 방 목록 화면에서 방을 선택하면 selectedRoomId를 갱신
          // 아래는 예시 코드, 실제로는 _homeStore.rooms 등에서 선택
          return ListView.builder(
            itemCount: _homeStore.rooms.length,
            itemBuilder: (context, index) {
              final room = _homeStore.rooms[index];
              return ListTile(
                title: Text('Room: ${room.id.substring(0, 8)}'),
                onTap: () {
                  setState(() {
                    selectedRoomId = room.id;
                  });
                  // 바로 채팅방으로 이동하려면 아래 코드 사용
                  Navigator.pushNamed(
                    context,
                    Routes.chat,
                    arguments: {
                      'userId': myUserId,
                      'roomId': room.id,
                    },
                  );
                },
              );
            },
          );
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (selectedRoomId == null) {
            ScaffoldMessenger.of(context).showSnackBar(
              SnackBar(content: Text('채팅방을 먼저 선택하세요!')),
            );
            return;
          }
          Navigator.pushNamed(
            context,
            Routes.chat,
            arguments: {
              'userId': myUserId,
              'roomId': selectedRoomId,
            },
          );
        },
        child: Icon(Icons.chat),
        tooltip: 'Start Chat',
      ),
    );
  }
}