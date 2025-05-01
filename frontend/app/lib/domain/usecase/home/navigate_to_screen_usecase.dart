import 'package:app/presentation/ticket/ticket.dart';
import 'package:flutter/material.dart';

import '../../../presentation/home/home.dart';

class NavigateToScreenUseCase {
  Widget call(String menuItem) {
    switch (menuItem) {
      case 'Home':
        return HomeScreen();
      case 'Likes':
      case 'Notification':
        return AuthorList();
      default:
        return Container();
    }
  }
}