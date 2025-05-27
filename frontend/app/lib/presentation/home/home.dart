import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:app/presentation/home/store/channel_store.dart';
import 'package:app/presentation/home/store/home_store.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';

import '../../di/service_locator.dart';
import '../../utils/routes/routes.dart';
import 'ai_advice_tab.dart';
import 'calendar_tab.dart';
import 'home_tab.dart';
import 'my_page_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final HomeStore _homeStore = getIt<HomeStore>();
  final AuthStore _authStore = getIt<AuthStore>();
  final ChannelStore _channelStore = getIt<ChannelStore>();
  final logger = getIt<Logger>();

  int _selectedIndex = 0;

  final List<Widget> _screens = [
    HomeTabScreen(),
    CalendarTab(),
    AiAdviceTabScreen(),
    MyPageScreen(),
  ];

  @override
  void initState() {
    super.initState();
    _authStore.loadAuthFromPrefs();
    logger.i('[HomeScreen] initState - Auth loaded');
  }

  void _onTabTapped(int index) {
    setState(() {
      _selectedIndex = index;
      logger.i('[HomeScreen] Tab changed: $_selectedIndex');
    });
  }

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
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            tooltip: '로그아웃',
            onPressed: () async {
              logger.i('[HomeScreen] 로그아웃 시도');
              await _authStore.logout();
            },
          ),
          Observer(
            builder: (_) => Stack(
              children: [
                IconButton(
                  icon: Icon(Icons.notifications),
                  onPressed: () {
                    _authStore.clearUnreadPush();
                    Navigator.pushNamed(
                      context,
                      Routes.notification,
                    );
                  },
                ),
                if (_authStore.unreadPushCount > 0)
                  Positioned(
                    right: 8,
                    top: 8,
                    child: Container(
                      padding: EdgeInsets.all(2),
                      decoration: BoxDecoration(
                        color: Colors.red,
                        borderRadius: BorderRadius.circular(8),
                      ),
                      constraints: BoxConstraints(
                        minWidth: 16,
                        minHeight: 16,
                      ),
                      child: Text(
                        '${_authStore.unreadPushCount}',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 12,
                        ),
                        textAlign: TextAlign.center,
                      ),
                    ),
                  ),
              ],
            ),
          ),
        ],
      ),
      body: _screens[_selectedIndex],
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.pink[600],
        unselectedItemColor: Colors.grey[500],
        backgroundColor: Colors.white,
        items: const [
          BottomNavigationBarItem(
            icon: Icon(Icons.home),
            label: '홈',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.calendar_month),
            label: '스케줄',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.psychology_alt),
            label: 'AI 조언',
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: '마이',
          ),
        ],
        onTap: _onTabTapped,
      ),
    );
  }
}