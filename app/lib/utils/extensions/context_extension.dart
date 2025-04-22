import 'package:flutter/material.dart';

extension ContextExtension on BuildContext {
  // 테마 접근 확장
  ThemeData get theme => Theme.of(this);
  
  // 색상 접근 단축
  ColorScheme get colorScheme => Theme.of(this).colorScheme;
  TextTheme get textTheme => Theme.of(this).textTheme;
  
  // 미디어 쿼리 접근 단축
  MediaQueryData get mediaQuery => MediaQuery.of(this);
  double get screenWidth => MediaQuery.of(this).size.width;
  double get screenHeight => MediaQuery.of(this).size.height;
  
  // 화면 방향 확인
  bool get isLandscape => MediaQuery.of(this).orientation == Orientation.landscape;
  bool get isPortrait => MediaQuery.of(this).orientation == Orientation.portrait;
  
  // 다크 모드 확인
  bool get isDarkMode => Theme.of(this).brightness == Brightness.dark;
  
  // 스낵바 표시 단축
  void showSnackBar(String message, {Duration? duration}) {
    ScaffoldMessenger.of(this).showSnackBar(
      SnackBar(
        content: Text(message),
        duration: duration ?? const Duration(seconds: 2),
      ),
    );
  }
  
  // 팝업 대화상자 표시 단축
  Future<T?> showSimpleDialog<T>({
    required String title,
    required String content,
    String? confirmText,
    String? cancelText,
  }) {
    return showDialog<T>(
      context: this,
      builder: (context) => AlertDialog(
        title: Text(title),
        content: Text(content),
        actions: [
          if (cancelText != null)
            TextButton(
              onPressed: () => Navigator.of(context).pop(),
              child: Text(cancelText),
            ),
          if (confirmText != null)
            TextButton(
              onPressed: () => Navigator.of(context).pop(true as T),
              child: Text(confirmText),
            ),
        ],
      ),
    );
  }
} 