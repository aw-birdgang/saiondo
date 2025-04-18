import 'package:hive/hive.dart';

import '../models/emotion_log.dart';

class EmotionService {
  static final _box = Hive.box<EmotionLog>('emotionLogs');

  static List<EmotionLog> getAllLogs() {
    return _box.values.toList().reversed.toList();
  }

  static Future<void> addLog(EmotionLog log) async {
    await _box.add(log);
  }

  static Future<void> clearAll() async {
    await _box.clear();
  }

  static Future<void> saveLog(EmotionLog log) async {
    await _box.add(log);
  }

  static Future<void> updateLog(int index, EmotionLog updated) async {
    await _box.putAt(index, updated);
  }

  static Future<void> deleteLog(int index) async {
    await _box.deleteAt(index);
  }

  static List<EmotionLog> getLogs() {
    return _box.values.toList();
  }
}