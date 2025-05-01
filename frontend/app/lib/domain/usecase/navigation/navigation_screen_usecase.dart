import 'package:app/presentation/ticket/ticket.dart';
import 'package:flutter/material.dart';

import '../../../presentation/home/home.dart';

class NavigationScreenUseCase {
  Widget call(int index) {
    switch (index) {
      case 0:
        return HomeScreen();
      case 1:
        return AuthorList();
      default:
        return AuthorList();
    }
  }
}