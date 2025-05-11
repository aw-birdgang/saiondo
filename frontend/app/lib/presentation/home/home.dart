import 'package:app/presentation/auth/store/auth_store.dart';
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
  final AuthStore _authStore = getIt<AuthStore>();

  @override
  void initState() {
    super.initState();
    _authStore.loadAuthFromPrefs();
  }

  @override
  Widget build(BuildContext context) {
    final myUserId = _authStore.userId;

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
        actions: [
          IconButton(
            icon: Icon(Icons.logout),
            tooltip: '로그아웃',
            onPressed: () async {
              await _authStore.logout();
            },
          ),
        ],
      ),
      body: Observer(
        builder: (_) {
          if (myUserId == null) {
            return Center(child: CircularProgressIndicator());
          }
          return Container();
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          if (_authStore.roomId == null) {
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
              'roomId': _authStore.roomId,
            },
          );
        },
        child: Icon(Icons.chat),
        tooltip: 'Start Chat',
      ),
    );
  }
}