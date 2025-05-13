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

  int _selectedIndex = 0;

  final List<Widget> _screens = [
    Center(child: Text('홈')),
    Center(child: Text('마이페이지')),
  ];

  @override
  void initState() {
    super.initState();
    _authStore.loadAuthFromPrefs();
  }

  void _onTabTapped(int index) {
    setState(() {
      _selectedIndex = index;
    });
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
          return _screens[_selectedIndex];
        },
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          var roomId = _authStore.roomId;
          if (roomId == null) {
            return;
          }

          print('userId :: $myUserId, roomId :: $roomId');

          Navigator.pushNamed(
            context,
            Routes.chat,
            arguments: {
              'userId': myUserId,
              'roomId': roomId,
            },
          );
        },
        child: Icon(Icons.chat),
        tooltip: 'Start Chat',
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: _onTabTapped,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '홈',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '마이',
          ),
        ],
      ),
    );
  }
}