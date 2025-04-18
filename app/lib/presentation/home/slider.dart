import 'package:flutter/material.dart';
import 'package:flutter_mobx/flutter_mobx.dart';
import 'package:logger/logger.dart';
import 'package:app/di/service_locator.dart';
import 'package:app/presentation/home/store/home/home_store.dart';

class SliderView extends StatelessWidget {
  // stores:---------------------------------------------------------------------
  final HomeStore _homeStore = getIt<HomeStore>();
  final logger = getIt<Logger>();

  @override
  Widget build(BuildContext context) {
    return Container(
      color: Colors.white,
      padding: const EdgeInsets.only(top: 30),
      child: Observer(
        builder: (_) => ListView.builder(
          itemCount: _homeStore.menuItems.length,
          itemBuilder: (context, index) {
            final menu = _homeStore.menuItems[index];
            return Observer(
              builder: (_) => _SliderMenuItem(
                title: menu.title,
                iconData: menu.iconData,
                isSelected: _homeStore.title == menu.title,
                onTap: () {
                  _homeStore.onMenuItemClick(menu.title);
                  _homeStore.closeDrawer();
                },
              ),
            );
          },
        ),
      ),
    );
  }
}

class _SliderMenuItem extends StatelessWidget {
  final String title;
  final IconData iconData;
  final bool isSelected;
  final VoidCallback onTap;

  const _SliderMenuItem({
    Key? key,
    required this.title,
    required this.iconData,
    required this.isSelected,
    required this.onTap,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return ListTile(
      title: Text(
        title,
        style: TextStyle(
          color: isSelected ? Colors.blue : Colors.black, // 선택된 경우 색상 변경
          fontFamily: 'BalsamiqSans_Regular',
        ),
      ),
      leading: Icon(iconData, color: isSelected ? Colors.blue : Colors.black),
      onTap: onTap, // onTap 이벤트 발생 시 전달된 함수 호출
    );
  }
}