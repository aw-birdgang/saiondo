import 'package:app/presentation/auth/store/auth_store.dart';
import 'package:app/presentation/home/store/home_store.dart';
import 'package:app/presentation/home/tabs/channel_tab.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';

import '../../di/service_locator.dart';
import '../../utils/locale/app_localization.dart';
import '../../utils/routes/routes.dart';
import 'tabs/calendar_tab.dart';
import 'tabs/home_tab.dart';
import 'tabs/my_page_tab.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  final HomeStore _homeStore = getIt<HomeStore>();
  final AuthStore _authStore = getIt<AuthStore>();
  final logger = getIt<Logger>();

  int _selectedIndex = 0;

  final List<Widget> _screens = [
    HomeTabScreen(),
    ChannelTabScreen(),
    CalendarTab(),
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
    final isChannelTab = _selectedIndex == 1;

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
              if (mounted) {
                Navigator.of(context).pushNamedAndRemoveUntil('/login', (route) => false);
              }
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
      body: Column(
        children: [
          if (isChannelTab)
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
              child: Row(
                children: [
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: Icon(Icons.person_add_alt_1),
                      label: Text('파트너 초대'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.blueAccent,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, Routes.invitePartner);
                      },
                    ),
                  ),
                  SizedBox(width: 12),
                  Expanded(
                    child: ElevatedButton.icon(
                      icon: Icon(Icons.mail),
                      label: Text('받은 초대장'),
                      style: ElevatedButton.styleFrom(
                        backgroundColor: Colors.pinkAccent,
                        foregroundColor: Colors.white,
                        padding: EdgeInsets.symmetric(vertical: 12),
                      ),
                      onPressed: () {
                        Navigator.pushNamed(context, Routes.channelInvitations);
                      },
                    ),
                  ),
                ],
              ),
            ),
          Expanded(child: _screens[_selectedIndex]),
        ],
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        selectedItemColor: Colors.pink[600],
        unselectedItemColor: Colors.grey[500],
        backgroundColor: Colors.white,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.home),
            label: AppLocalizations.of(context).translate('home'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.group),
            label: AppLocalizations.of(context).translate('channel'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.calendar_month),
            label: AppLocalizations.of(context).translate('schedule'),
          ),
          BottomNavigationBarItem(
            icon: Icon(Icons.person),
            label: AppLocalizations.of(context).translate('my'),
          ),
        ],
        onTap: _onTabTapped,
      ),
    );
  }
}