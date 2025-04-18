import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:flutter_slider_drawer/flutter_slider_drawer.dart';
import 'package:logger/logger.dart';
import 'package:app/presentation/home/slider.dart';
import 'package:app/presentation/home/store/home/home_store.dart';

import '../../di/service_locator.dart';

class HomeScreen extends StatefulWidget {
  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  //stores:---------------------------------------------------------------------
  final HomeStore _homeStore = getIt<HomeStore>();
  final logger = getIt<Logger>();

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      primary: true,
      appBar: _buildAppBar(),
      body: Observer(
        builder: (_) => SliderDrawer(
          appBar: SliderAppBar(
            appBarColor: Colors.white,
            title: Observer(
              builder: (_) => Text(
                _homeStore.title,
                style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
              ),
            ),
          ),
          key: _homeStore.sliderDrawerKey, // Drawer 상태 사용
          sliderOpenSize: 179,
          slider: SliderView(),
          child: Observer( // 화면 상태 관리
            builder: (_) => _homeStore.currentScreen,
          ),
        ),
      ),
    );
  }

  PreferredSizeWidget _buildAppBar() {
    return PreferredSize(
      preferredSize: const Size.fromHeight(56.0),
      child: SliderAppBar(
        appBarColor: Colors.white,
        title: Observer(
          builder: (_) => Text(
            _homeStore.title,
            style: const TextStyle(fontSize: 22, fontWeight: FontWeight.w700),
          ),
        ),
      ),
    );
  }

}