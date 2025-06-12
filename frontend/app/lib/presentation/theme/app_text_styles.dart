import 'package:flutter/material.dart';
import 'app_colors.dart';

class AppTextStyles {
  static const TextStyle title = TextStyle(
    fontSize: 38,
    fontWeight: FontWeight.w900,
    color: AppColors.textMain,
    letterSpacing: 4,
    fontFamily: 'Pacifico',
    shadows: [
      Shadow(
        color: AppColors.shadow,
        blurRadius: 8,
        offset: Offset(0, 2),
      ),
    ],
  );

  static const TextStyle subtitle = TextStyle(
    fontSize: 18,
    color: AppColors.textSub,
    fontWeight: FontWeight.w500,
    fontFamily: 'NanumPenScript',
  );

  static const TextStyle sectionTitle = TextStyle(
    fontSize: 20,
    fontWeight: FontWeight.bold,
    color: AppColors.textMain,
    fontFamily: 'Nunito',
  );

  static const TextStyle body = TextStyle(
    fontSize: 16,
    color: AppColors.textMain,
    fontFamily: 'Nunito',
  );

  static const TextStyle error = TextStyle(
    color: AppColors.error,
    fontWeight: FontWeight.w600,
    fontFamily: 'Nunito',
  );

  static const TextStyle label = TextStyle(
    fontSize: 13,
    color: AppColors.grey,
    fontFamily: 'Nunito',
  );

  static const TextStyle point = TextStyle(
    fontWeight: FontWeight.bold,
    fontSize: 18,
    color: AppColors.textMain,
    fontFamily: 'Nunito',
  );

  static const TextStyle button = TextStyle(
    fontWeight: FontWeight.bold,
    fontSize: 16,
    fontFamily: 'Nunito',
    color: AppColors.white,
  );

  static const TextStyle chip = TextStyle(
    color: AppColors.heartDark,
    fontWeight: FontWeight.w600,
    fontFamily: 'Nunito',
  );

  static const TextStyle cardTitle = TextStyle(
    fontWeight: FontWeight.bold,
    fontSize: 17,
    color: AppColors.heartAccent,
    fontFamily: 'Nunito',
  );

  static const TextStyle cardDescription = TextStyle(
    color: AppColors.grey,
    fontSize: 13,
    fontFamily: 'Nunito',
  );

  // ...필요시 추가
}
