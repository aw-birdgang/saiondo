import 'package:flutter/material.dart';

class LovelyAvatar extends StatelessWidget {
  final String imageUrl;
  const LovelyAvatar({required this.imageUrl});
  @override
  Widget build(BuildContext context) {
    return Container(
      decoration: BoxDecoration(
        shape: BoxShape.circle,
        gradient: LinearGradient(
          colors: [Colors.pinkAccent, Colors.blueAccent],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
      ),
      child: CircleAvatar(
        backgroundImage: NetworkImage(imageUrl),
        backgroundColor: Colors.transparent,
        radius: 36,
      ),
    );
  }
}