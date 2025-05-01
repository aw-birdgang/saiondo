import 'package:app/di/service_locator.dart';
import 'package:app/presentation/navigation/store/navigation_store.dart';
import 'package:curved_navigation_bar/curved_navigation_bar.dart';
import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';

void main() => runApp(MaterialApp(home: BottomNavBar()));

class BottomNavBar extends StatefulWidget {
  @override
  _BottomNavBarState createState() => _BottomNavBarState();
}

class _BottomNavBarState extends State<BottomNavBar> {
  //stores:---------------------------------------------------------------------
  final NavigationStore _navigationStore = getIt<NavigationStore>();
  final logger = getIt<Logger>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Observer(
        builder: (_) => _navigationStore.currentScreen,
      ),
      bottomNavigationBar: Observer(
        builder: (_) => CurvedNavigationBar(
          index: _navigationStore.selectedIndex,
          items: <Widget>[
            Icon(Icons.list, size: 45),
            Icon(Icons.compare_arrows, size: 45),
          ],
          color: Colors.blueAccent,
          backgroundColor: Colors.white,
          animationCurve: Curves.easeInOut,
          onTap: (index) {
            _navigationStore.updateIndex(index);
          },
          letIndexChange: (index) => true,
        ),
      ),
    );
  }
}