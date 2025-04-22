import 'package:cloud_firestore/cloud_firestore.dart';

class DailyTip {
  final String id;
  final String title;
  final String content;
  final String category;
  final int priority;
  final Timestamp createdAt;

  DailyTip({
    required this.id,
    required this.title,
    required this.content,
    required this.category,
    required this.priority,
    required this.createdAt,
  });

  factory DailyTip.fromJson(Map<String, dynamic> json) {
    final aiAdvice = json['aiAdvice'] ?? {};
    final content = aiAdvice['content'] ?? '';

    return DailyTip(
      id: json['id'] ?? '',
      title: content.toString().split('\n').first,
      content: content,
      category: json['category'] ?? 'general',
      createdAt: json['createdAt'] is Timestamp
          ? json['createdAt']
          : Timestamp.now(),
      priority: json['priority'] ?? 1,
    );
  }

  // factory DailyTip.fromFirestore(DocumentSnapshot doc) {
  //   final data = doc.data() as Map<String, dynamic>;
  //   return DailyTip(
  //     id: doc.id,
  //     title: data['title'] ?? '',
  //     content: data['content'] ?? '',
  //     category: data['category'] ?? 'general',
  //     priority: data['priority'] ?? 1,
  //     createdAt: data['createdAt'] ?? Timestamp.now(),
  //   );
  // }
}