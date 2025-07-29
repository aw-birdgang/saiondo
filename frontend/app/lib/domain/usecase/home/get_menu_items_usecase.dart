import 'package:flutter/material.dart';

class GetMenuItemsUseCase {
  List<Menu> call() {
    return [
      Menu(Icons.home, 'Home'),
      Menu(Icons.add_circle, 'Add Post'),
      Menu(Icons.notifications_active, 'Notification'),
      Menu(Icons.favorite, 'Likes'),
      Menu(Icons.settings, 'Setting'),
      Menu(Icons.arrow_back_ios, 'LogOut'),
    ];
  }
}

class Menu {
  final IconData iconData;
  final String title;
  const Menu(this.iconData, this.title);
}
