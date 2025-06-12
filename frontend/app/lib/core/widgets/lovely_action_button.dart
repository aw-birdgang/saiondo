import 'package:flutter/material.dart';
import '../../presentation/theme/app_text_styles.dart';

class LovelyActionButton extends StatelessWidget {
  final IconData icon;
  final String label;
  final Color color;
  final VoidCallback? onPressed;

  const LovelyActionButton({
    required this.icon,
    required this.label,
    required this.color,
    required this.onPressed,
  });

  @override
  Widget build(BuildContext context) {
    return ElevatedButton.icon(
      icon: Icon(icon, size: 22, color: AppTextStyles.button.color),
      label: Padding(
        padding: const EdgeInsets.symmetric(vertical: 2.0),
        child: Text(
          label,
          style: AppTextStyles.button,
        ),
      ),
      style: ElevatedButton.styleFrom(
        backgroundColor: color,
        minimumSize: const Size(double.infinity, 48),
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        elevation: 4,
        shadowColor: color.withOpacity(0.2),
      ),
      onPressed: onPressed,
    );
  }
}
