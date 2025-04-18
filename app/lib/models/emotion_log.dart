import 'package:hive/hive.dart';

part 'emotion_log.g.dart';

@HiveType(typeId: 0)
class EmotionLog extends HiveObject {
  @HiveField(0)
  final String date;

  @HiveField(1)
  final String emoji;

  @HiveField(2)
  final int temperature;

  @HiveField(3)
  final List<String> tags;

  @HiveField(4)
  final String note;

  @HiveField(5)
  List<String>? events;

  EmotionLog({
    required this.date,
    required this.emoji,
    required this.temperature,
    required this.tags,
    required this.note,
    this.events,
  });
}