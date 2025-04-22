import 'package:cloud_firestore/cloud_firestore.dart';
import 'package:flutter/material.dart';

class EmotionLog {
  final String id;
  final String date;
  final String emoji;
  final int temperature;
  final List<String> tags;
  final String note;
  final List<String>? events;
  final Timestamp createdAt;
  final String userId; // 사용자 ID

  EmotionLog({
    required this.id,
    required this.date,
    required this.emoji,
    required this.temperature,
    required this.tags,
    required this.note,
    this.events,
    required this.createdAt,
    required this.userId,
  });

  factory EmotionLog.fromFirestore(DocumentSnapshot doc) {
    final data = doc.data() as Map<String, dynamic>;
    int parseTemperature(dynamic value) {
      if (value == null) return 50;
      if (value is int) return value;
      if (value is double) return value.round();
      return 50;
    }
    return EmotionLog(
      id: doc.id,
      date: data['date'] ?? '',
      emoji: data['emoji'] ?? '😐',
      temperature: parseTemperature(data['temperature']),  // 변환 로직 적용
      tags: data['tags'] != null ? List<String>.from(data['tags'] as List) : [],
      note: data['note'] ?? '',
      events: data['events'] != null ? List<String>.from(data['events'] as List) : null,
      createdAt: data['createdAt'] ?? Timestamp.now(),
      userId: data['userId'] ?? '',
    );
  }

  Map<String, dynamic> toFirestore() {
    return {
      'date': date,
      'emoji': emoji,
      'temperature': temperature,
      'tags': tags,
      'note': note,
      'events': events ?? [],
      'createdAt': createdAt,
      'userId': userId,
    };
  }

  @override
  String toString() {
    return '''EmotionLog{
      id: $id,
      date: $date,
      emoji: $emoji,
      temperature: $temperature,
      tags: $tags,
      events: $events,
      note: $note,
      createdAt: ${createdAt.toDate()},
      userId: $userId
    }''';
  }

  void printDetails() {
    debugPrint('''
=== EmotionLog 상세 정보 ===
문서 ID: $id
날짜: $date
이모지: $emoji
온도: $temperature°
태그: ${tags.join(', ')}
이벤트: ${events?.join(', ') ?? '없음'}
노트: $note
작성일: ${createdAt.toDate()}
사용자 ID: $userId
========================
''');
  }

}