import 'package:flutter/material.dart';

import '../../presentation/theme/app_colors.dart';
import '../../presentation/theme/app_text_styles.dart';

class LovelyLoadingIndicator extends StatelessWidget {
  const LovelyLoadingIndicator();

  @override
  Widget build(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 12.0),
      child: Center(
        child: Row(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            SizedBox(
              width: 28,
              height: 28,
              child: CircularProgressIndicator(
                strokeWidth: 3,
                valueColor: AlwaysStoppedAnimation<Color>(AppColors.shadow),
              ),
            ),
            const SizedBox(width: 12),
            Text(
              'AI가 답변을 작성 중입니다...',
              style: AppTextStyles.body.copyWith(
                color: AppColors.heartAccent,
                fontWeight: FontWeight.w600,
                fontSize: 15,
              ),
            ),
            const SizedBox(width: 8),
            const Text('💗', style: TextStyle(fontSize: 18)),
          ],
        ),
      ),
    );
  }
}
