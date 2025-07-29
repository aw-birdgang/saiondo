import 'package:flutter/material.dart';

import '../../../presentation/home/home.dart';

class NavigationScreenUseCase {
  Widget call(int index) {
    switch (index) {
      case 0:
        return HomeScreen();
      default:
        return HomeScreen();
    }
  }
}
