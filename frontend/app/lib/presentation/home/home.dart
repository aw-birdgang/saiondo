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
        builder: (_) => _homeStore.currentScreen,
      ),
      floatingActionButton: FloatingActionButton(
        onPressed: () {
          Navigator.of(context).pushNamedAndRemoveUntil(
            Routes.chat,
                (Route<dynamic> route) => false,
          );
        },
        child: Icon(Icons.chat),
        tooltip: 'Start Chat',
      ),
    );
  }
}